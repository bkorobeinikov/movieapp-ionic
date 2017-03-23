import { Component, ChangeDetectionStrategy } from '@angular/core';
import { App, NavParams, ModalController, ToastController } from "ionic-angular";

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Store } from "@ngrx/store";

import * as fromRoot from './../../store/reducers';

import { PaymentPage } from "../payment/payment";

import { Cinema, CinemaHall, CinemaHallSeat, Movie, Showtime } from "../../store/models";

import * as _ from 'lodash';
import { NewsPage } from "../news/news";

import { ui } from "../../store/actions";

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
        private store: Store<fromRoot.State>
    ) {
        this.order$ = store.select(fromRoot.getBookingOrder);
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