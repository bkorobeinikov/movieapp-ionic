import { Component, OnDestroy } from '@angular/core';

import { Account, Cinema } from './../../store/models';

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Store } from "@ngrx/store";
import { State } from "./../../store";
import * as actionsAccount from './../../store/actions/account';
import * as selectors from './../../store/selectors';

import * as _ from 'lodash';

@Component({
    selector: 'page-account',
    templateUrl: 'account.html'
})
export class AccountPage implements OnDestroy {

    public loggingIn$: Observable<boolean>;

    public account: Account;
    public cinema: Cinema;

    public creds: {
        username?: string,
        password?: string,
    };

    private subscription: Subscription = new Subscription();

    constructor(
        private store: Store<State>
    ) {
        this.creds = {};

        this.loggingIn$ = this.store.select(selectors.getAccountLoggingIn);

        let s = this.store.select(selectors.getAccount)
            .withLatestFrom(this.store.select(selectors.getCinemaEntities))
            .subscribe(([account, cinemas]) => this.onAccountChange(account, cinemas));

        this.subscription.add(s);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onAccountChange(account, cinemas) {
        if (!account) {
            this.account = null;
            this.cinema = null;
            return;
        }

        this.account = account;
        if (cinemas != null)
            this.cinema = cinemas[account.cinemaId];
    }

    onNotifUpdates(checked: boolean) {
        this.store.dispatch(new actionsAccount.ChangeNotificationsAction({
            updates: checked,
        }));
    }

    onNotifTickets(checked: boolean) {
        this.store.dispatch(new actionsAccount.ChangeNotificationsAction({
            tickets: checked,
        }));
    }

    onCinemaChange() {
        console.log('cinema tapped');
    }

    logout() {
        this.subscription.unsubscribe();
        this.store.dispatch(new actionsAccount.LogoutAction());
    }

}
