import { Component, ChangeDetectionStrategy } from '@angular/core';
import { App, ModalController, ToastController, ActionSheetController, AlertController, LoadingController } from "ionic-angular";

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/first';
import { Subscription } from "rxjs/Subscription";
import { Store } from "@ngrx/store";

import { State } from './../../store';
import * as selectors from './../../store/selectors';

import { PaymentPage } from "../payment/payment";
import { LoginNavPage } from "./../login/login-nav";

import { Cinema, CinemaHall, CinemaHallSeat, Movie, Showtime } from "../../store/models";

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
                this.askToLogin();
            } else {
                this.askHowToPay();
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
                    position: "top",
                    dismissOnPageChange: true,
                }).present();
            }
        });

        modal.present();
    }

}