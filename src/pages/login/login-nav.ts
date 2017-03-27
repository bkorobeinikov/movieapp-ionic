import { Component, OnInit } from "@angular/core";

import { LoginPage } from './login';

import { Store } from "@ngrx/store";
import { State } from "../../store";
import * as selectors from './../../store/selectors';
import { ViewController } from "ionic-angular";

@Component({
    selector: "page-login-nav",
    template: '<ion-nav [root]="root"></ion-nav>'
})
export class LoginNavPage implements OnInit {
    public root: any = LoginPage;

    constructor(
        private store: Store<State>,
        private viewCtrl: ViewController,
    ) {
    }

    ngOnInit() {
        this.store.select(selectors.getAccountLoggedIn)
            .skip(1).first().subscribe((loggedIn) => {
                if (loggedIn) {
                    this.viewCtrl.dismiss();
                }
            });
    }
}