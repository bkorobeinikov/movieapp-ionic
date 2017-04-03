import { Component } from '@angular/core';
import { App, NavParams, ViewController, AlertController, LoadingController, NavController, Tabs, ToastController } from "ionic-angular";
import { TicketPage } from "../ticket/ticket";

import { Store } from "@ngrx/store";

import { State } from './../../store';
import { Ticket, Cinema, CinemaHall, Movie, Showtime, CinemaHallSeat } from './../../store/models';
import * as actionsUi from './../../store/actions/ui';
import * as actionsBooking from './../../store/actions/booking';
import * as actionsTicket from './../../store/actions/ticket';

import { BookingPage } from './../booking/booking';

type Order = {
    cinema: Cinema,
    hall: CinemaHall,
    movie: Movie,
    showtime: Showtime,
    seats: CinemaHallSeat[]
};


@Component({
    selector: "page-payment",
    templateUrl: "payment.html"
})
export class PaymentPage {

    public order: Order;

    constructor(
        private appCtrl: App,
        private viewCtrl: ViewController,
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private navParams: NavParams,
        private toastCtrl: ToastController,
        private store: Store<State>
    ) {
        this.order = navParams.get("order");
    }

    complete() {
        this.onPaymentSuccess();
    }

    cancel() {

        let confirm = this.alertCtrl.create({
            title: 'Cancel Payment?',
            message: 'Do you really want to cancel payment operation. You will be redirected back to choosing seats.',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.onPaymentCancel();
                    }
                }
            ]
        });
        confirm.present();
    }

    fail() {
        this.onPaymentFail();
    }

    onPaymentSuccess() {

        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();

        this.getTabNavByIndex(0).popToRoot({ animate: false }).then(() => {
            this.getTabs().select(1);
            return this.getTabNavByIndex(1).push(TicketPage, {}, { animate: false });
        }).then(() => {
            // load real ticket
            let ticket: Ticket = {
                id: Math.round(Math.random() * 100000000) + "",
                movieUid: this.order.movie.uid,
                cinemaId: this.order.cinema.id,
                hallId: this.order.hall.id,
                hallName: this.order.hall.name,
                techId: this.order.showtime.techId,
                time: this.order.showtime.time.toDate(),
                seats: this.order.seats.map(s => ({
                    id: Math.round(Math.random() * 1000000000) + "",
                    ticketId: undefined,
                    ticketBarcode: "9000001682121",
                    row: s.row, seat: s.seat, price: {
                        algorithm: "fake",
                        amountBonuses: 0,
                        amountCash: 149,
                        bookingFee: 0,
                        discount: 10,
                        method: "fake",
                        priceTicket: 150,
                        priceTicketInclDiscount: 149,
                        purchaseFee: 0,
                        typeDiscount: "fake",
                        valueDiscount: "1",
                    },
                    vatRate: undefined,
                })),
                showtimeId: this.order.showtime.id,
                transactionDate: undefined,
                transactionId: undefined,
            };

            this.store.dispatch(new actionsTicket.LoadSuccessAction([ticket]));
            this.store.dispatch(new actionsTicket.SelectAction(ticket.id));
            this.store.dispatch(new actionsUi.RootChangeTabAction(1));

            return loading.dismiss();
        }).then(() => {

            this.toastCtrl.create({
                message: "Congrats! You have purchased tickets.",
                duration: 3000,
                position: "bottom",
                dismissOnPageChange: true,
                showCloseButton: true,
                closeButtonText: "OK",
            }).present();

            return this.viewCtrl.dismiss();
        });
    }

    onPaymentFail() {
        let loading = this.loadingCtrl.create({
            content: 'Loading...'
        });
        loading.present();

        this.getActiveTabNav().popTo(BookingPage).then(() => {
            this.store.dispatch(new actionsBooking.HallLoadAction(this.order.showtime));
            return loading.dismiss();
        }).then(() => {
            this.toastCtrl.create({
                message: "Transaction failed. If you think it is our problem please contact us",
                duration: 4000,
                position: "bottom",
                dismissOnPageChange: true,
                showCloseButton: true,
                closeButtonText: "OK",
            }).present();

            return this.viewCtrl.dismiss();
        });
    }

    onPaymentCancel() {
        this.getActiveTabNav().popTo(BookingPage).then(() => {
            this.store.dispatch(new actionsBooking.HallLoadAction(this.order.showtime))
        }).then(() => {
            this.viewCtrl.dismiss();
        });
    }

    private getTabs(): Tabs {
        return this.appCtrl.getRootNav().getActiveChildNav()
    }

    private getTabNavByIndex(index) {
        return this.getTabs().getByIndex(index).getActive().getNav();
    };

    private getActiveTabNav() {
        return this.getTabs().getSelected().getActive().getNav();
    }
}