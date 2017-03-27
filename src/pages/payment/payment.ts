import { Component } from '@angular/core';
import { App, NavParams, ViewController, AlertController, LoadingController } from "ionic-angular";
import { TicketPage } from "../ticket/ticket";

import { Store } from "@ngrx/store";

import { State } from './../../store';
import { Ticket, Cinema, CinemaHall, Movie, Showtime, CinemaHallSeat } from './../../store/models';
import * as actionsUi from './../../store/actions/ui';
import * as actionsBooking from './../../store/actions/booking';
import * as actionsTicket from './../../store/actions/ticket';

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
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private navParams: NavParams,
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
            message: 'Do you really want to cancel payment operation. You will be redirected back to chosing seats.',
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
        this.viewCtrl.dismiss({
            fail: true
        });
    }

    onPaymentSuccess() {
        var nav = this.appCtrl.getRootNav();

        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();

        nav.push(TicketPage).then(() => {
            return nav.remove(1, nav.length() - 2);
        }).then(() => {
            // load real ticket
            let ticket: Ticket = {
                id: Math.round(Math.random() * 100000000) + "",
                movieId: this.order.movie.id,
                cinemaId: this.order.cinema.id,
                hallId: this.order.hall.id,
                hallName: this.order.hall.name,
                techId: this.order.showtime.techId,
                time: this.order.showtime.time.toDate(),
                seats: this.order.seats.map(s => ({
                    id: Math.round(Math.random() * 1000000000) + "",
                    row: s.row, seat: s.seat, price: s.price
                })),
            };

            this.store.dispatch(new actionsTicket.LoadSuccessAction([ticket]));
            this.store.dispatch(new actionsTicket.SelectAction(ticket.id));
            this.store.dispatch(new actionsUi.RootChangeTabAction(1));

            return loading.dismiss();
        }).then(() => {
            return this.viewCtrl.dismiss();
        });
    }

    onPaymentCancel() {
        var nav = this.appCtrl.getRootNav();

        nav.pop().then(() => {
            this.store.dispatch(new actionsBooking.HallLoadAction(this.order.showtime))
        }).then(() => {
            this.viewCtrl.dismiss();
        });
    }
}