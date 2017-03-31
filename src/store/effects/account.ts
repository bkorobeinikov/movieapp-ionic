import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';

import { Action, Store } from "@ngrx/store";
import { Effect, Actions } from '@ngrx/effects';

import { AccountService } from "../../core/account.service";

import { State } from './../reducers';
import * as actionsAccount from './../actions/account';
import * as selectors from './../selectors';

import { AsyncStatus } from './../models';
import { ServiceResponse } from "../../core/service-response.model";

@Injectable()
export class AccountEffects {

    @Effect()
    login$: Observable<Action> = this.actions$
        .ofType(actionsAccount.ActionTypes.LOGIN)
        .switchMap(action => {
            return this.doLogin(action)
                .map(res => new actionsAccount.LoginSuccessAction({ authToken: res.data.authToken }))
                .catch((res) => of(new actionsAccount.LoginFailAction(res)));
        });

    @Effect()
    onLoginSuccess$: Observable<Action> = this.actions$
        .ofType(actionsAccount.ActionTypes.LOGIN_SUCCESS)
        .map(() => new actionsAccount.UpdateAction());

    @Effect()
    update$: Observable<Action> = this.actions$
        .ofType(actionsAccount.ActionTypes.UPDATE)
        .switchMap(action => {
            return this.accountService.getProfile()
                .map(res => new actionsAccount.UpdateSuccessAction({ account: res.data.account, tickets: res.data.tickets }))
                .catch((res: ServiceResponse<any>) => {
                    if (res.code == "-100") {
                        return of(new actionsAccount.UpdateFailAction({ requireLogin: true }));
                    } else {
                        return of(new actionsAccount.UpdateFailAction({ requireLogin: false }));
                    }
                });
        });

    @Effect({ dispatch: false })
    logout$ = this.actions$
        .ofType(actionsAccount.ActionTypes.LOGOUT)
        .switchMap(action => {
            return this.accountService.logout();
        });


    @Effect()
    onUpdateFail$ = this.actions$
        .ofType(actionsAccount.ActionTypes.UPDATE_FAIL)
        .withLatestFrom(this.store.select(selectors.getAccountAuth))
        .map(([actionRaw, auth]) => {
            let action = <actionsAccount.UpdateFailAction>actionRaw;

            if (action.payload.requireLogin == false)
                return new actionsAccount.LogoutAction();

            if (auth.method != actionsAccount.LoginMethod.Email) {
                throw new Error("Unsupported auth method " + actionsAccount.LoginMethod[auth.method]);
            }

            return new actionsAccount.LoginAction({
                loginMethod: actionsAccount.LoginMethod.Email,
                email: auth.email,
                password: auth.password,
            });
        });

    @Effect()
    verifyAuth$ = this.actions$
        .ofType(actionsAccount.ActionTypes.VERIFY_AUTH)
        .withLatestFrom(this.store.select(selectors.getAccountLoggedIn))
        // tslint:disable-next-line:no-unused-variable
        .filter(([actionRaw, loggedIn]) => loggedIn == true)
        .switchMap(() => {
            return this.accountService.getProfile()
                .mergeMap((res: any) => ([
                    new actionsAccount.UpdateSuccessAction({ account: res.data.account, tickets: res.data.tickets }),
                    new actionsAccount.VerifyAuthFinishAction({ status: AsyncStatus.Success }),
                ]))
                .catch((res: ServiceResponse<any>) => {
                    if (res.code == "-100") {
                        return this.doReloginFlow();
                    }

                    return Observable.from([
                        new actionsAccount.LogoutAction(),
                        new actionsAccount.VerifyAuthFinishAction({ status: AsyncStatus.Failed })
                    ]);
                });
        });

    constructor(
        private actions$: Actions,
        private accountService: AccountService,
        private store: Store<State>) { }


    private doLogin(action: actionsAccount.LoginAction): Observable<ServiceResponse<{ authToken: string }>> {
        var payload = action.payload;

        switch (payload.loginMethod) {
            case actionsAccount.LoginMethod.Email: {
                return this.accountService.login(payload.email, payload.password);
            }
            case actionsAccount.LoginMethod.Facebook: {
                Observable.throw(new Error("Not Implemented"));
            }
        }
    }

    private doReloginFlow() {
        return this.store.select(selectors.getAccountAuth).first()
            .switchMap(auth => {
                if (auth.method != actionsAccount.LoginMethod.Email) {
                    return Observable.throw(new Error("Unsupported auth method " + actionsAccount.LoginMethod[auth.method]));
                }

                let failed$ = Observable.from([
                    new actionsAccount.VerifyAuthFinishAction({ status: AsyncStatus.Failed }),
                    new actionsAccount.LogoutAction(),
                ]);

                return this.doLogin(
                    new actionsAccount.LoginAction({
                        loginMethod: auth.method,
                        email: auth.email,
                        password: auth.password
                    }))
                    .do((res) => {
                        this.store.dispatch(new actionsAccount.VerifyAuthLoginSuccessAction(
                            new actionsAccount.LoginSuccessAction({ authToken: res.data.authToken })))
                    }).switchMap(() => {
                        return this.accountService.getProfile()
                            .mergeMap(res => ([
                                new actionsAccount.VerifyAuthUpdateSuccessAction(
                                    new actionsAccount.UpdateSuccessAction({ account: res.data.account, tickets: res.data.tickets, })),
                                new actionsAccount.VerifyAuthFinishAction({ status: AsyncStatus.Success }),
                            ]))
                            .catch(() => failed$);
                    }).catch(() => failed$);
            })
    }
}