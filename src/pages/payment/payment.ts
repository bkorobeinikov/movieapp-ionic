import { Component } from '@angular/core';
import { App, NavParams } from "ionic-angular";
import { NewsPage } from "../news/news";

@Component({
    selector: "page-payment",
    templateUrl: "payment.html"
})
export class PaymentPage {

    constructor(
        private appCtrl: App,
        private navParams: NavParams,
    ) {

    }

    complete() {
        var nav = this.appCtrl.getRootNav();
        nav.push(NewsPage).then(() => {
            return nav.remove(1, nav.length()-2);
        }).then(() => {
            nav.getActiveChildNav().select(nav.getActiveChildNav().getByIndex(1));
        });
    }
}