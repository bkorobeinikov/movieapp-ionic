import { Component } from '@angular/core';

import { App, NavParams } from "ionic-angular";

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
        
    }
}