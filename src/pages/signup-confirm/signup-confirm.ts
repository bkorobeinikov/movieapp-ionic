import { Component, OnDestroy } from '@angular/core';
import { NavController, AlertController, NavParams } from "ionic-angular";
import { Store } from "@ngrx/store";
import { State } from "./../../store";
import * as selectors from './../../store/selectors';
import * as actionsAccount from './../../store/actions/account';

import * as _ from 'lodash';
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: "page-signup-confirm",
    templateUrl: "signup-confirm.html"
})
export class SignUpConfirmPage implements OnDestroy {

    public code: string;

    public creds: {
        tel?: string,
        email?: string,
        password?: string,
    };

    private subscription: Subscription = new Subscription();

    constructor(
        private store: Store<State>,
        private alertCtrl: AlertController,
        private navCtrl: NavController,
        private navParams: NavParams,
    ) {
        this.creds = navParams.get("creds");
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    canConfirm() {
        return _.isEmpty(this.code) == false;
    }

    confirm() {

        this.store.select(selectors.getAccountSignupStage2Op).skip(1)
            .filter(op => !op.pending).first()
            .subscribe(op => {
                if (!op.success) {
                    this.alertCtrl.create({
                        title: "Failed",
                        message: op.message,
                        buttons: [{
                            text: "Dismiss",
                            handler: () => {
                                this.navCtrl.pop();
                            }
                        }]
                    }).present();
                } else {
                    let successAlert = this.alertCtrl.create({
                        title: "Success",
                        message: "Use your credentials to login",
                        buttons: ["OK"],
                    });

                    this.navCtrl.popTo(this.navCtrl.getByIndex(0)).then(() => successAlert.present());
                }
            })

        this.store.dispatch(new actionsAccount.SignUpStage2Action({
            email: this.creds.email,
            password: this.creds.password,
            smsCode: this.code,
            phone: this.creds.tel
        }));
    }
}