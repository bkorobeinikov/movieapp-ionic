import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

import { Account } from "../store/models";
import { Http, } from "@angular/http";

import { BaseService } from "./base.service";

import moment from 'moment';

import * as _ from 'lodash';

@Injectable()
export class AccountService extends BaseService {

    constructor(http: Http) {
        super(http);
    }

    getUpdate(): Observable<Account> {
        return Observable.of(this.getTempAccount()).delay(500);
    }

    loginFacebook(): Observable<Account> {
        return Observable.of(this.getTempAccount()).delay(500);
    }

    loginPassword(creds: {
        username: string,
        password: string,
    }): Observable<Account> {
        return Observable.of(this.getTempAccount()).delay(500);
    }

    private getTempAccount(): Account {
        return {
            id: Math.round(Math.random() * 1000000000) + "",
            name: "John Doe",
            email: "johndoe@example.com",
            phone: "+380681234567",
            bonuses: Math.round(Math.random() * 1000),
            cardId: "900000168212",

            cinemaId: "pk-lvov2",
            notifications: {
                tickets: true,
                updates: true,
            }
        };
    }
}