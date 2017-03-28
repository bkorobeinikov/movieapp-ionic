import { Component } from "@angular/core";

import { LoginPage } from './login';
import { NavParams } from "ionic-angular";

@Component({
    selector: "page-login-nav",
    template: '<ion-nav [root]="root" [rootParams]="params"></ion-nav>'
})
export class LoginNavPage {
    public root: any = LoginPage;
    public params: any;

    constructor(
        private navParams: NavParams,
    ) {
        this.params = navParams.data;
    }
}