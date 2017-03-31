import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

import { Account, Ticket } from "../store/models";
import { Http, } from "@angular/http";

import { BaseService } from "./base.service";

import { Store } from "@ngrx/store";
import { State } from "../store";

import { PlanetaKinoV2Service } from "./planetakino-api/planetakino-api.service";

import { ServiceResponse } from './service-response.model';
import { PlanetaKinoV2JsonResponse } from "./planetakino-api/json-response";

import { Mapper } from './mapper';

@Injectable()
export class AccountService extends BaseService {

    constructor(
        http: Http,
        private planetaKinoService: PlanetaKinoV2Service,
        store: Store<State>) {
        super(http, store);
    }

    login(login: string, password: string): Observable<ServiceResponse<{ authToken: string }>> {
        return this.planetaKinoService.login({
            login: login,
            password: password,
        }).map(res => {
            return {
                code: res.code,
                message: res.message,
                data: Mapper.mapToLogin(res.data),
            };
        }).catch((err: PlanetaKinoV2JsonResponse<any>) => {
            throw {
                code: err.code,
                message: err.message,
                data: undefined
            };
        });
    }

    getProfile(): Observable<ServiceResponse<{ account: Account, tickets: Ticket[] }>> {
        return this.planetaKinoService.getProfile()
            .map(res => {
                return {
                    code: res.code,
                    message: res.message,
                    data: {
                        account: Mapper.mapToAccount(res.data),
                        tickets: Mapper.mapToTickets(res.data),
                    },
                };
            }).catch((err: PlanetaKinoV2JsonResponse<any>) => {
                throw {
                    code: err.code,
                    message: err.message,
                    data: undefined
                };
            });;
    }
}