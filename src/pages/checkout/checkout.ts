import { Component, ChangeDetectionStrategy } from '@angular/core';
import { App, ModalController, ToastController } from "ionic-angular";

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Store } from "@ngrx/store";

import { State } from './../../store';
import * as selectors from './../../store/selectors';

import { PaymentPage } from "../payment/payment";

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

    public canPay: boolean = true;

    private subscription: Subscription = new Subscription();

    constructor(
        private appCtrl: App,
        private modalCtrl: ModalController,
        private toastCtrl: ToastController,
        private store: Store<State>
    ) {
        this.order$ = store.select(selectors.getBookingOrder);
    }

    ngOnInit() {
        let s = this.order$.subscribe(order => {
            this.order = order;
        });
        this.subscription.add(s);
        this.canPay = true;
    }

    ngOnDetroy() {
        this.subscription.unsubscribe();
    }

    getTotalPrice() {
        return _.sumBy(this.order.seats, s => s.price);
    }

    pay() {
        this.canPay = false;

        let modal = this.modalCtrl.create(PaymentPage, {
            order: this.order,
        });
        modal.onDidDismiss(data => {
            if (data == null)
                return;

            if (data.fail) {
                this.toastCtrl.create({
                    message: "Your transaction failed. If you think it is our problem please contact us",
                    duration: 2000,
                    position: "bottom",
                    dismissOnPageChange: true,
                    showCloseButton: true,
                    closeButtonText: "OK",
                }).present();
            }

        });

        modal.present();
    }


}