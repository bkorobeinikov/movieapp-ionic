import { Component, OnDestroy } from '@angular/core';
import { NavController, AlertController } from "ionic-angular";

import { Account, Cinema } from './../../store/models';

import { Subscription } from "rxjs/Subscription";
import { Store } from "@ngrx/store";
import { State } from "./../../store";
import * as actionsAccount from './../../store/actions/account';
import * as selectors from './../../store/selectors';

import { CinemasPage } from './../cinemas/cinemas';

import { Observable } from "rxjs/Observable";
import { AsyncOperation } from "../../store/viewModels";

@Component({
    selector: 'page-account',
    templateUrl: 'account.html'
})
export class AccountPage implements OnDestroy {

    public updateOp$: Observable<AsyncOperation>;

    public account: Account;
    public cinema: Cinema;

    private subscription: Subscription = new Subscription();

    constructor(
        private navCtrl: NavController,
        private store: Store<State>,
        private alertCtrl: AlertController,
    ) {
        this.updateOp$ = this.store.select(selectors.getAccountUpdateOp);

        let s = this.store.select(selectors.getAccount)
            .withLatestFrom(this.store.select(selectors.getCinemaEntities))
            .withLatestFrom(this.store.select(selectors.getCinemaCurrentId))
            .subscribe(([[account, cinemas], cinemaCurrentId]) => this.onAccountChange(account, cinemas[cinemaCurrentId]));

        this.subscription.add(s);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onAccountChange(account, cinema) {
        if (!account) {
            this.account = null;
            this.cinema = null;
            return;
        }

        this.account = account;
        this.cinema = cinema;
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
        this.navCtrl.push(CinemasPage);
    }

    logout() {
        this.alertCtrl.create({
            message: "Do you really want to Log out?",
            buttons: [
                {
                    text: 'No',
                    handler: () => { }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.subscription.unsubscribe();
                        this.store.dispatch(new actionsAccount.LogoutAction());
                    }
                }
            ]
        }).present();
    }

}
