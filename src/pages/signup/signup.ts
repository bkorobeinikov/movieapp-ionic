import { Component, OnDestroy } from '@angular/core';
import { NavController, AlertController } from "ionic-angular";
import { Store } from "@ngrx/store";
import { State } from "./../../store";
import * as selectors from './../../store/selectors';
import * as actionsAccount from './../../store/actions/account';

import * as _ from 'lodash';
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: "page-signup",
    templateUrl: "signup.html"
})
export class SignUpPage implements OnDestroy {

    public creds: {
        tel?: string,
        email?: string,
        password?: string,
    };

    public loggingIn: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private store: Store<State>,
        private alertCtrl: AlertController,
        private navCtrl: NavController
    ) {
        this.creds = {};

        this.subscription.add(this.store.select(selectors.getAccountLoggingIn).subscribe(loggingIn => {
            this.loggingIn = loggingIn;
        }));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    canSignUp() {
        return _.isEmpty(this.creds.tel) == false && _.isEmpty(this.creds.email) == false
            && _.isEmpty(this.creds.password) == false;
    }

    signup() {
        this.alertCtrl.create({
            message: "Sign Up is not Implemented",
        });
    }

    signin() {
        this.navCtrl.pop();
    }

    facebook() {
        this.store.dispatch(new actionsAccount.LoginAction({
            loginMethod: actionsAccount.LoginMethod.Facebook,
        }));
    }
}