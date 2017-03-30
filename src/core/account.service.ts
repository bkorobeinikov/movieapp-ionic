import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

import { Account, Ticket } from "../store/models";
import { Http, } from "@angular/http";

import { BaseService } from "./base.service";

import moment from 'moment';

import * as _ from 'lodash';

import { Store } from "@ngrx/store";
import { State } from "../store";

import { PlanetaKinoV2Service } from "./planetakino-api/planetakino-api.service";
import { PlanetaKinoV2Login, PlanetaKinoV2Profile } from "./planetakino-api/models";

import { ServiceResponse } from './service-response.model';
import * as selectors from './../store/selectors';
import { PlanetaKinoV2JsonResponse } from "./planetakino-api/json-response";

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
                data: this.mapToLogin(res.data),
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
                        account: this.mapToAccount(res.data),
                        tickets: this.mapToTickets(res.data),
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

    loginFacebook(): Observable<Account> {
        //return Observable.of(this.getTempAccount()).delay(500);
        return Observable.of({}).delay(500);
    }

    private mapToLogin(data: PlanetaKinoV2Login) {
        return {
            authToken: data.authToken,
        };
    }

    private mapToAccount(data: PlanetaKinoV2Profile): Account {
        return {
            id: data.customerCard,
            cardId: data.customerCard,
            bonuses: parseInt(data.bonuses),
            email: data.email,
            name: data.firstName + " " + data.lastName,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            notifications: {
                tickets: false,
                updates: false,
            },
        };
    }

    private mapToTickets(data: PlanetaKinoV2Profile): Ticket[] {
        if (_.isEmpty(data.tickets) || _.isEmpty(data.tickets.purchased))
            return [];

        return data.tickets.purchased.map(t => (<Ticket>{
            id: t.transactionId,
            cinemaId: t.theaterId,
            hallId: t.HallId,
            hallName: t.HallName,
            movieUid: t.movieId,
            techId: t.technology.id,
            showtimeId: t.showtimeId,
            time: moment(t.movieDate).toDate(),
            transactionId: t.transactionId,
            transactionDate: moment(t.transactionDate).toDate(),
            seats: t.seats.map(s => ({
                id: s.seatId,
                row: s.row,
                seat: s.seat,
                ticketId: s.ticketId,
                ticketBarcode: s.ticketBarcode,
                vatRate: s.VATRate,
                price: {
                    algorithm: s.price[0].algoritm,
                    amountBonuses: parseFloat(s.price[0].amountBonuses),
                    amountCash: parseFloat(s.price[0].amountCash),
                    bookingFee: parseFloat(s.price[0].bookingFee),
                    discount: parseFloat(s.price[0].discount),
                    method: s.price[0].method,
                    priceTicket: parseFloat(s.price[0].priceTicket),
                    priceTicketInclDiscount: parseFloat(s.price[0].priceTicketInclDiscount),
                    purchaseFee: parseFloat(s.price[0].purchaseFee),
                    typeDiscount: s.price[0].typeDiscount,
                    valueDiscount: s.price[0].valueDiscount,
                }
            }))
        }));
    }
}