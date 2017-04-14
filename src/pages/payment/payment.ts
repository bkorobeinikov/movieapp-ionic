import { Component } from '@angular/core';
import { App, NavParams, ViewController, AlertController, LoadingController, NavController, Tabs, ToastController, Tab } from "ionic-angular";
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

    async onPaymentSuccess() {

        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();

        await this.getTabNavByIndex(0).popToRoot({ animate: false })
        await this.selectTab(1);
        await this.getTabNavByIndex(1).push(TicketPage, {}, { animate: false });

        let ticket = this.createFakeTicket();
        this.store.dispatch(new actionsTicket.LoadSuccessAction([ticket]));
        this.store.dispatch(new actionsTicket.SelectAction(ticket.id));
        this.store.dispatch(new actionsUi.RootChangeTabAction(1));

        await loading.dismiss();

        this.toastCtrl.create({
            message: "Congrats! You have purchased tickets.",
            duration: 3000,
            position: "bottom",
            dismissOnPageChange: true,
            showCloseButton: true,
            closeButtonText: "OK",
        }).present();

        this.viewCtrl.dismiss();
    }

    private createFakeTicket() {
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

        return ticket;
    }

    async onPaymentFail() {
        let loading = this.loadingCtrl.create({
            content: 'Loading...'
        });
        loading.present();

        await this.getActiveTabNav().popTo(BookingPage);
        this.store.dispatch(new actionsBooking.HallLoadAction(this.order.showtime));

        await loading.dismiss();
        this.toastCtrl.create({
            message: "Transaction failed. If you think it is our problem please contact us",
            duration: 4000,
            position: "bottom",
            dismissOnPageChange: true,
            showCloseButton: true,
            closeButtonText: "OK",
        }).present();

        this.viewCtrl.dismiss();
    }

    async onPaymentCancel() {
        await this.getActiveTabNav().popTo(BookingPage);
        this.store.dispatch(new actionsBooking.HallLoadAction(this.order.showtime))
        this.viewCtrl.dismiss();
    }

    private getTabs(): Tabs {
        return this.appCtrl.getRootNav().getActiveChildNav();
    }

    private getTabNavByIndex(index) {
        console.log("getTabNavByIndex()", index, this.getTabs().getByIndex(index).getActive(), this.getTabs().getByIndex(index).getActiveChildNav());

        return this.getTabs().getByIndex(index).getActive().getNav();
    };

    private getActiveTabNav() {
        return this.getTabs().getSelected().getActive().getNav();
    }

    private selectTab(tabOrIndex: number | Tab): Promise<Tab> {
        return new Promise((resolve, reject) => {
            this.getTabs().ionChange.first().subscribe((tab) => {
                resolve(tab);
            });

            this.getTabs().select(tabOrIndex, { animate: false });
        });
    }
}