import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { State } from "./../../store";
import * as actionsAccount from './../../store/actions/account';
import * as selectors from './../../store/selectors';

import { NavController, ViewController, NavParams } from "ionic-angular";

import { SignUpPage } from './../signup/signup';

import * as _ from "lodash";

@Component({
    selector: "page-login",
    templateUrl: "login.html"
})
export class LoginPage {

    public creds: {
        email?: string,
        password?: string,
    };

    private isModal: boolean = false;

    constructor(
        private store: Store<State>,
        private viewCtrl: ViewController,
        private navCtrl: NavController,
        private navParams: NavParams,
    ) {
        this.isModal = navParams.get('modal');
        this.creds = {};
    }

    signup() {
        this.navCtrl.push(SignUpPage);
    }

    cancel() {
        this.dismiss();
    }

    private dismiss() {
        if (this.isModal) {
            this.navCtrl.parent.getActive().dismiss();
        }
    }

    loginFacebook() {
        this.creds = {};
        this.store.dispatch(new actionsAccount.LoginAction({
            loginMethod: actionsAccount.LoginMethod.Facebook,
        }));
    }

    canLogin() {
        return _.isEmpty(this.creds.email) == false && _.isEmpty(this.creds.password) == false;
    }

    login() {
        this.store.dispatch(new actionsAccount.LoginAction({
            loginMethod: actionsAccount.LoginMethod.Email,
            email: this.creds.email,
            password: this.creds.password,
        }));
    }

    register() {
        this.navCtrl.push(SignUpPage);
    }
}