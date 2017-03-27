import { Component } from "@angular/core";

import { LoginPage } from './login';

@Component({
    selector: "page-login-nav",
    template: '<ion-nav [root]="root" rootParams="{modal: true}"></ion-nav>'
})
export class LoginNavPage {
    public root: any = LoginPage;

    constructor() { }
}