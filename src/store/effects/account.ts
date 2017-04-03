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
import { Account } from './../models';

import { AsyncStatus } from './../viewModels';
import { ServiceResponse } from "../../core/service-response.model";

@Injectable()
export class AccountEffects {

    @Effect()
    login$: Observable<Action> = this.actions$
        .ofType(actionsAccount.ActionTypes.LOGIN)
        .filter(actionRaw => !(<actionsAccount.LoginAction>actionRaw).payload.fake) // filter fake login
        .switchMap(action => {
            return this.doLogin(action)
                .map(res => new actionsAccount.LoginSuccessAction({ authToken: res.data.authToken }))
                .catch((res: ServiceResponse<any>) => of(new actionsAccount.LoginFailAction({ errorMessage: res.message })));
        });

    @Effect()
    onLoginSuccess$: Observable<Action> = this.actions$
        .ofType(actionsAccount.ActionTypes.LOGIN_SUCCESS)
        .filter(actionRaw => !(<actionsAccount.LoginSuccessAction>actionRaw).payload.fake) // filter fake login        
        .map(() => new actionsAccount.UpdateAction());

    @Effect()
    loginFake$: Observable<Action> = this.actions$
        .ofType(actionsAccount.ActionTypes.LOGIN)
        .filter(actionRaw => (<actionsAccount.LoginAction>actionRaw).payload.fake) // filter fake login
        .mergeMap(action => {

            let fakeAccount: Account = {
                id: Math.round(Math.random() * 1000000000).toString(),
                name: "John Doe",
                firstName: "John",
                lastName: "Doe",
                bonuses: Math.round(Math.random() * 10000),
                cardId: "9000001682121",
                email: "john.doe@example.com",
                notifications: {
                    tickets: true,
                    updates: false,
                },
                phone: "+1234567890",
                fake: true,
            };

            return [
                new actionsAccount.LoginSuccessAction({ authToken: "fake_auth_token", fake: true }),
                new actionsAccount.UpdateSuccessAction({ account: fakeAccount, tickets: [] })
            ];
        });

    @Effect()
    update$: Observable<Action> = this.actions$
        .ofType(actionsAccount.ActionTypes.UPDATE)
        .switchMap(action => {
            return this.accountService.getProfile()
                .map(res => new actionsAccount.UpdateSuccessAction({ account: res.data.account, tickets: res.data.tickets }))
                .catch((res: ServiceResponse<any>) => {
                    if (res.code == "-100") {
                        return of(new actionsAccount.UpdateFailAction({ requireLogin: true, errorMessage: res.message }));
                    } else {
                        return of(new actionsAccount.UpdateFailAction({ requireLogin: false, errorMessage: res.message }));
                    }
                });
        });

    @Effect()
    logout$ = this.actions$
        .ofType(actionsAccount.ActionTypes.LOGOUT)
        .switchMap(() => {
            return this.accountService.logout()
                .map(() => new actionsAccount.LogoutSuccessAction())
                .catch(() => of(new actionsAccount.LogoutSuccessAction()));
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
        .withLatestFrom(this.store.select(selectors.getAccount))
        // tslint:disable-next-line:no-unused-variable
        .filter(([[actionRaw, loggedIn], account]) => loggedIn == true && !account.fake)
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
                        new actionsAccount.VerifyAuthFinishAction({ status: AsyncStatus.Fail, message: res.message })
                    ]);
                });
        });

    @Effect()
    verifyAuthFake$ = this.actions$
        .ofType(actionsAccount.ActionTypes.VERIFY_AUTH)
        .withLatestFrom(this.store.select(selectors.getAccountLoggedIn))
        .withLatestFrom(this.store.select(selectors.getAccount))
        // tslint:disable-next-line:no-unused-variable
        .filter(([[actionRaw, loggedIn], account]) => loggedIn == true && account.fake)
        .map(() => {
            return new actionsAccount.VerifyAuthFinishAction({ status: AsyncStatus.Success });
        });


    @Effect()
    signupStage1$ = this.actions$
        .ofType(actionsAccount.ActionTypes.SIGNUP_STAGE1)
        .switchMap(actionRaw => {
            let action = <actionsAccount.SignUpStage1Action>actionRaw;
            return this.accountService.sendActivationSms(action.payload.phone)
                .map(() => new actionsAccount.SignUpStage1SuccessAction())
                .catch((res: ServiceResponse<any>) => of(new actionsAccount.SignUpStage1FailAction({ message: res.message })));
        });

    @Effect()
    signupStage2$ = this.actions$
        .ofType(actionsAccount.ActionTypes.SIGNUP_STAGE2)
        .switchMap(actionRaw => {
            let action = <actionsAccount.SignUpStage2Action>actionRaw;
            let data = action.payload;
            return this.accountService.register(data.email, data.password, data.smsCode, data.phone)
                .map(() => new actionsAccount.SignUpStage2SuccessAction())
                .catch((res: ServiceResponse<any>) => of(new actionsAccount.SignUpStage2FailAction({ message: res.message })));
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

                let onFail$ = (res: ServiceResponse<any>) => {
                    return Observable.from([
                        new actionsAccount.VerifyAuthFinishAction({ status: AsyncStatus.Fail, message: res.message }),
                        new actionsAccount.LogoutAction(),
                    ]);
                };

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
                            .catch(onFail$);
                    }).catch(onFail$);
            })
    }
}