import { Component } from '@angular/core';
import { App, NavParams, ViewController, Alert, AlertController, LoadingController } from "ionic-angular";
import { NewsPage } from "../news/news";

import { Store } from "@ngrx/store";

import * as fromRoot from './../../store/reducers';
import { ui, booking } from './../../store/actions';

@Component({
    selector: "page-payment",
    templateUrl: "payment.html"
})
export class PaymentPage {

    public order: any;

    constructor(
        private appCtrl: App,
        private viewCtrl: ViewController,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private navParams: NavParams,
        private store: Store<fromRoot.State>
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

        nav.push(NewsPage).then(() => {
            return nav.remove(1, nav.length() - 2);
        }).then(() => {
            this.store.dispatch(new booking.CompleteAction(this.order.showtime.id));
            this.store.dispatch(new ui.RootChangeTabAction(1));
            
            return loading.dismiss();
        }).then(() => {
            return this.viewCtrl.dismiss();
        });
    }

    onPaymentCancel() {
        var nav = this.appCtrl.getRootNav();

        nav.pop().then(() => {
            this.store.dispatch(new booking.HallLoadAction(this.order.showtime))
        }).then(() => {
            this.viewCtrl.dismiss();
        });
    }
}