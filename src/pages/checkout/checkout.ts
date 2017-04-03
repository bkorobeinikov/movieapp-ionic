import { Component, ChangeDetectionStrategy } from '@angular/core';
import { App, ModalController, ToastController, ActionSheetController, AlertController, LoadingController } from "ionic-angular";

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from "rxjs/Subscription";
import { Store } from "@ngrx/store";

import { State } from './../../store';
import * as selectors from './../../store/selectors';
import * as actionsAccount from './../../store/actions/account';

import { PaymentPage } from "../payment/payment";
import { LoginNavPage } from "./../login/login-nav";

import { Cinema, CinemaHall, CinemaHallSeat, Movie, Showtime } from "../../store/models";
import { AsyncStatus } from './../../store/viewModels';

import * as _ from 'lodash';

type Order = {
    cinema: Cinema,
    hall: CinemaHall,
    movie: Movie,
    showtime: Showtime,
    seats: CinemaHallSeat[]
};

@Component({
    selector: 'page-checkout',
    templateUrl: 'checkout.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPage {

    public order$: Observable<Order>;
    public order: Order;
    public cinema: Cinema;
    public showtime: Showtime;

    public canPay: boolean = true;

    private subscription: Subscription = new Subscription();

    constructor(
        private appCtrl: App,
        private modalCtrl: ModalController,
        private toastCtrl: ToastController,
        private actionCtrl: ActionSheetController,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private store: Store<State>
    ) {
        this.order$ = store.select(selectors.getBookingOrder);

        let s = this.order$.filter(o => o != null).subscribe(order => {
            this.order = order;
            this.cinema = this.order.cinema;
            this.showtime = this.order.showtime;
        });
        this.subscription.add(s);
        this.canPay = true;
    }

    ngOnInit() {
    }

    ngOnDetroy() {
        this.subscription.unsubscribe();
    }

    getTotalPrice() {
        return _.sumBy(this.order.seats, s => s.price);
    }

    getTotalBonus() {
        return _.sumBy(this.order.seats, s => s.bonus);
    }

    pay() {
        this.store.select(selectors.getAccountLoggedIn).first().subscribe(loggedIn => {
            if (!loggedIn) {
                this.askToLogin()
            } else {
                this.checkAuth();
            }
        });
    }

    askHowToPay() {
        let actionSheet = this.actionCtrl.create({
            title: 'How to pay for tickets?',
            buttons: [
                {
                    text: 'Credit/Debit Card',
                    handler: () => {
                        this.payWithCard();
                    }
                },
                {
                    text: 'With Bonuses',
                    handler: () => {
                        actionSheet.onDidDismiss(() => {
                            this.payWithBonuses();
                        });
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });

        actionSheet.present();
    }

    payWithCard() {
        this.canPay = false;

        let modal = this.modalCtrl.create(PaymentPage, {
            order: this.order,
        });

        modal.present();
    }

    payWithBonuses() {
        let loading = this.loadingCtrl.create({
            content: "Please wait..."
        });

        loading.present();

        loading.onDidDismiss(() => {
            let alert = this.alertCtrl.create({
                title: "Warning",
                message: "You dont have bonuses for this operation",
                buttons: ['Dismiss']
            });
            alert.present();
        });

        setTimeout(function () {
            loading.dismiss();
        }, 500);

    }

    checkAuth() {

        let loading = this.loadingCtrl.create({
            content: "Preparing for payment"
        });
        loading.present();

        this.store.select(selectors.getAccountVerifyOp).skip(1)
            .filter(verifyAuth => verifyAuth.status != AsyncStatus.Pending)
            .first().subscribe(verifyAuth => {
                if (verifyAuth.status != AsyncStatus.Success) {
                    loading.dismiss().then(() => {
                        this.alertCtrl.create({
                            message: "Verification Failed. You where logged out.",
                            buttons: ["Dismiss"],
                        }).present();
                    });
                } else {
                    loading.dismiss().then(() => {
                        this.askHowToPay();
                    });
                }
            });

        // to check if user has valid auth token to purchase tickets
        // we need to update user profile, it will automatically relogin user if auth token is outdated 
        // of will logout user if credentials are invalid.
        this.store.dispatch(new actionsAccount.VerifyAuthAction());
    }

    askToLogin() {
        let modal = this.modalCtrl.create(LoginNavPage, {
            modal: true,
        });

        this.store.select(selectors.getAccountLoggedIn).skip(1).first().subscribe(loggedIn => {
            if (loggedIn) {
                modal.dismiss();

                this.toastCtrl.create({
                    message: "Successfully logged in",
                    duration: 2000,
                    position: "bottom",
                    showCloseButton: true,
                    closeButtonText: "OK",
                    dismissOnPageChange: true,
                }).present();
            }
        });

        modal.present();
    }

}