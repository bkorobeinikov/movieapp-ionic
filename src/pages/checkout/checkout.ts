import { Component } from '@angular/core';

import { App, NavParams } from "ionic-angular";
import { PaymentPage } from "../payment/payment";

@Component({
    selector: 'page-checkout',
    templateUrl: 'checkout.html'
})
export class CheckoutPage {

    constructor(
        private appCtrl: App,
        private navParams: NavParams,
    ) {

    }

    pay() {
        this.appCtrl.getRootNav().push(PaymentPage, {
        });
    }
}