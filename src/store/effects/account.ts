import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/merge';

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

import { Action, Store } from "@ngrx/store";
import { Effect, Actions } from '@ngrx/effects';

import { AccountService } from "../../core/account.service";

import { State } from './../reducers';
import * as actionsAccount from './../actions/account';
import { Account } from './../models';

@Injectable()
export class AccountEffects {

    @Effect()
    login$: Observable<Action> = this.actions$
        .ofType(actionsAccount.ActionTypes.LOGIN)
        .switchMap(action => {
            return this.doLogin(action)
            .map(account => new actionsAccount.LoginSuccessAction(account))
            .catch((res) => of(new actionsAccount.LoginFailAction(res)));
        });

    @Effect()
    update$: Observable<Action> = this.actions$
        .ofType(actionsAccount.ActionTypes.UPDATE)
        .switchMap(action => {
            const next$ = this.actions$.ofType(actionsAccount.ActionTypes.UPDATE);

            return this.accountService.getUpdate()
                .takeUntil(next$)
                .map((res) => new actionsAccount.UpdateSuccessAction(res))
                .catch(() => of(new actionsAccount.UpdateFailAction(null)));
        });

    constructor(
        private actions$: Actions,
        private accountService: AccountService,
        private store: Store<State>) { }


    private doLogin(action: actionsAccount.LoginAction): Observable<Account> {
        var payload = action.payload;

        switch(payload.loginMethod) {
            case actionsAccount.LoginMethod.Username: {
                return this.accountService.loginPassword({
                    username: payload.username,
                    password: payload.password,
                });
            }
            case actionsAccount.LoginMethod.Facebook: {
                return this.accountService.loginFacebook();
            }
        }
    }
}