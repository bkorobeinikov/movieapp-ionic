import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { State } from "./../../store";
import { NavController, ViewController } from "ionic-angular";

import { SignUpPage } from './../signup/signup';

@Component({
    selector: "page-login",
    templateUrl: "login.html"
})
export class LoginPage {

    constructor(
        private store: Store<State>,
        private viewCtrl: ViewController,
        private navCtrl: NavController
    ) {
    }

    signup() {
        this.navCtrl.push(SignUpPage);
    }

    cancel() {
        this.dismiss();
    }

    private dismiss() {
        if (this.isModal()) {
            this.navCtrl.parent.getActive().dismiss();
        }
    }

    private isModal() {
        let parent = this.navCtrl.parent;
        return parent && parent.getActive().dismiss && parent.parent == null;
    }
}