import { Component } from '@angular/core';
import { App, NavParams } from "ionic-angular";
import { NewsPage } from "../news/news";

import { Store } from "@ngrx/store";

import * as fromRoot from './../../store/reducers';
import { ui } from './../../store/actions';

@Component({
    selector: "page-payment",
    templateUrl: "payment.html"
})
export class PaymentPage {

    constructor(
        private appCtrl: App,
        private navParams: NavParams,
        private store: Store<fromRoot.State>
    ) {

    }

    complete() {
        var nav = this.appCtrl.getRootNav();
        nav.push(NewsPage).then(() => {
            return nav.remove(1, nav.length() - 2);
        }).then(() => {
            this.store.dispatch(new ui.RootChangeTabAction(1));
        });
    }
}