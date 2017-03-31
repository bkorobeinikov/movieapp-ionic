import { Component, OnDestroy } from '@angular/core';
import { Store } from "@ngrx/store";
import { State } from "./../../store";
import * as actionsAccount from './../../store/actions/account';
import * as selectors from './../../store/selectors';

import { NavController, ViewController, NavParams, AlertController } from "ionic-angular";

import { SignUpPage } from './../signup/signup';

import * as _ from "lodash";
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: "page-login",
    templateUrl: "login.html"
})
export class LoginPage implements OnDestroy {

    public creds: {
        email?: string,
        password?: string,
    };

    public loggingIn: boolean = false;
    private isModal: boolean = false;

    private subscription: Subscription = new Subscription;

    constructor(
        private store: Store<State>,
        private viewCtrl: ViewController,
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private navParams: NavParams,
    ) {
        this.isModal = navParams.get('modal');
        this.creds = {};

        this.subscription.add(this.store.select(selectors.getAccountLoggingIn).subscribe(loggingIn => {
            this.loggingIn = loggingIn;
        }));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    cancel() {
        this.dismiss();
    }

    private dismiss() {
        if (this.isModal) {
            this.navCtrl.parent.getActive().dismiss();
        }
    }

    facebook() {
        if (this.loggingIn)
            return;

        this.alertCtrl.create({
            message: "Signing in via Facebook is not supported by PlanetaKino",
            buttons: ["Dismiss"],
        }).present();
    }

    canLogin() {
        return _.isEmpty(this.creds.email) == false && _.isEmpty(this.creds.password) == false;
    }

    login() {
        if (this.loggingIn)
            return;

        this.store.dispatch(new actionsAccount.LoginAction({
            loginMethod: actionsAccount.LoginMethod.Email,
            email: this.creds.email,
            password: this.creds.password,
        }));
    }

    signup() {
        this.navCtrl.push(SignUpPage);
    }
}