import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { Store } from "@ngrx/store";
import { State } from "./../../store";
import * as selectors from './../../store/selectors';
import * as actionsAccount from './../../store/actions/account';

@Component({
    selector: "page-signup",
    templateUrl: "signup.html"
})
export class SignUpPage {

    public creds: {
        email?: string,
        password?: string,
    };

    constructor(
        private store: Store<State>,
        private navCtrl: NavController
    ) {
        this.creds = {};
    }

    register() {
        //this.store.dispatch(new actionsAccount.)
    }

    facebook() {
        this.store.dispatch(new actionsAccount.LoginAction({
            loginMethod: actionsAccount.LoginMethod.Facebook,
        }));
    }
}