import { Component, OnDestroy } from '@angular/core';
import { Store } from "@ngrx/store";
import { State } from "./../../store";
import * as actionsAccount from './../../store/actions/account';
import * as selectors from './../../store/selectors';

import { NavController, ViewController, NavParams, AlertController } from "ionic-angular";

import { SignUpPage } from './../signup/signup';

import * as _ from "lodash";
import { Subscription } from "rxjs/Subscription";

import { AsyncOperation } from "../../store/viewModels";

@Component({
    selector: "page-login",
    templateUrl: "login.html"
})
export class LoginPage implements OnDestroy {

    public creds: {
        email?: string,
        password?: string,
    };

    public loginOp: AsyncOperation;

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

        this.subscription.add(this.store.select(selectors.getAccountLoginOp)
            .subscribe(loginOp => this.loginOp = loginOp));
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
        if (this.loginOp.pending)
            return;

        this.alertCtrl.create({
            title: "Not Supported",
            message: "Signing in via Facebook is not supported",
            buttons: ["Dismiss"],
        }).present();
    }

    canLogin() {
        return _.isEmpty(this.creds.email) == false && _.isEmpty(this.creds.password) == false;
    }

    fakeLogin() {
        console.log("fake login");
        if (this.loginOp.pending)
            return;

        this.store.select(selectors.getAccountLoginOp).skip(1).filter(op => op.fail).first()
            .subscribe(loginOp => {
                this.alertCtrl.create({
                    title: "Login Failed",
                    message: loginOp.message,
                    buttons: ["Dismiss"],
                }).present();
            });

        this.store.dispatch(new actionsAccount.LoginAction({
            loginMethod: actionsAccount.LoginMethod.Email,
            email: this.creds.email,
            password: this.creds.password,

            fake: true,
        }));
    }

    login() {
        if (this.loginOp.pending)
            return;

        this.store.select(selectors.getAccountLoginOp).skip(1).filter(op => op.fail).first()
            .subscribe(loginOp => {
                this.alertCtrl.create({
                    title: "Login Failed",
                    message: loginOp.message,
                    buttons: ["Dismiss"],
                }).present();
            });

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