import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

import { Http, RequestOptionsArgs, Headers, URLSearchParams, ResponseContentType } from "@angular/http";

import { BaseService } from "./../base.service";

import {
    PlanetaKinoV2City, PlanetaKinoV2Movie,
    PlanetaKinoV2Theater, PlanetaKinoTheater,
    PlanetaKinoV2Hall, PlanetaKinoV2Showtime,
    PlanetaKinoV2Login, PlanetaKinoV2Profile,
} from './models';
import { PlanetaKinoV2JsonResponse } from './json-response';

import moment from 'moment';

import * as _ from 'lodash';
import { Store } from "@ngrx/store";
import { State } from "./../../store";
import * as selectors from './../../store/selectors';

@Injectable()
export class PlanetaKinoV2Service extends BaseService {

    private baseUrl = "http://cabinet.planetakino.ua/mapi/2";
    private citiesUrl = this.baseUrl + "/cities";
    private moviesUrl = this.baseUrl + "/movies";
    private theatersUrl = this.baseUrl + "/theaters";
    private hallSchemeUrl = this.baseUrl + "/hall-scheme";
    private movieDatesUrl = this.baseUrl + "/movie-dates";
    private showtimesUrl = this.baseUrl + "/showtimes";

    private baseUrl2 = "https://cabinet.planeta-kino.com.ua/mapiv2";
    private profileUrl = this.baseUrl2 + "/GetProfile";
    private loginUrl = this.baseUrl2 + "/Login";
    private logoutUrl = this.baseUrl2 + "/Logout";
    private sendActivationSmsUrl = this.baseUrl2 + "/SendActivationSMS";
    private registerUrl = this.baseUrl2 + "/register";

    private theatersAllUrl = "http://planetakino.ua/api/theatres";

    constructor(
        http: Http,
        private store: Store<State>) {
        super(http);
    }

    getCities(): Observable<PlanetaKinoV2City[]> {
        return this.getData<any>(this.citiesUrl).map(res => {
            let data = res.cities.city;
            return data;
        });
    }

    getMovies(data: { cityId: string }): Observable<{ inTheaters: PlanetaKinoV2Movie[], soon: PlanetaKinoV2Movie[] }> {
        let search = this.buildParams(data);
        return this.getData<any>(this.moviesUrl, search, { cityId: data.cityId }).map(res => {
            return {
                inTheaters: res.inTheaters.movie,
                soon: res.soon.movie
            };
        });
    }

    getTheatersAll(): Observable<PlanetaKinoTheater[]> {
        return super.getData<any>(this.theatersAllUrl).map(res => {
            return res.theatres.theatre;
        });
    }

    getTheaters(data: { cityGroupId: string }): Observable<PlanetaKinoV2Theater[]> {
        let search = this.buildParams({
            cityId: data.cityGroupId,
        });
        return this.getData<any>(this.theatersUrl, search, { cityId: data.cityGroupId }).map(res => {
            return res.theatres.theatre;
        });
    }

    getHall(data: { cityId: string, showtimeId: string, cinemaId: string }): Observable<PlanetaKinoV2Hall> {
        let search = this.buildParams({
            showtimeId: data.showtimeId,
            theaterId: data.cinemaId,
        });
        return this.getData<any>(this.hallSchemeUrl, search, { cityId: data.cityId }).map(res => {
            return res.hall;
        });
    }

    getMovieDates(data: { movieId: string, cityId: string }): Observable<Date[]> {
        let search = this.buildParams({
            movieId: data.movieId,
            cityId: data.cityId,
        });

        return this.getData<any>(this.movieDatesUrl, search, { cityId: data.cityId }).map(res => {
            return res.showDates.showDate.map(d => moment(d).toDate());
        });
    }

    getMovieShowtimes(data: { movieId: string, cityId: string, date: Date }): Observable<PlanetaKinoV2Showtime[]> {
        let search = this.buildParams({
            movieId: data.movieId,
            cityId: data.cityId,
            date: moment(data.date).format("YYYY-MM-DD"),
        });

        return this.getData<any>(this.showtimesUrl, search, { cityId: data.cityId }).map(res => {
            return res.theaters.theater.showtimes.showtime;
        });
    }

    login(data: { login: string, password: string }): Observable<PlanetaKinoV2JsonResponse<PlanetaKinoV2Login>> {
        return this.postData<PlanetaKinoV2Login>(this.loginUrl, {
            login: data.login,
            password: data.password,
        });
    }

    logout(): Observable<PlanetaKinoV2JsonResponse<any>> {
        return this.postData<PlanetaKinoV2JsonResponse<any>>(this.logoutUrl, {});
    }

    getProfile(): Observable<PlanetaKinoV2JsonResponse<PlanetaKinoV2Profile>> {
        return this.postData<PlanetaKinoV2Profile>(this.profileUrl, { ticketsinfo: "y" });
    }

    sendActivationSms(data: { phone: string }): Observable<PlanetaKinoV2JsonResponse<{ smsCode: string }>> {
        return this.postData<{ smsCode: string }>(this.sendActivationSmsUrl, { phone: data.phone });
    }

    register(data: { email: string, smsCode: string, password: string, phone: string }): Observable<PlanetaKinoV2JsonResponse<any>> {
        return this.postData<any>(this.registerUrl, {
            email: data.email,
            smsCode: data.smsCode,
            password: data.password,
            phone: data.phone,
        });
    }

    protected buildParams(params: any): URLSearchParams {
        let res = new URLSearchParams();
        Object.keys(params).forEach(key => {
            res.set(key, params[key]);
        });
        return res;
    }

    protected getData<T>(url: string, search?: URLSearchParams, headers?: { [name: string]: string }): Observable<T> {
        headers = Object.assign({}, headers, {});

        let options: RequestOptionsArgs = {
            headers: new Headers(headers),
            search: search,
        };

        return this.startWithAuthToken().switchMap(authToken => {
            if (!_.isEmpty(authToken))
                options.headers.append("Auth-Token", authToken);

            return super.getData<T>(url, options).map(res => {
                console.log('planetakino-api:', url, res);
                return res;
            });
        });
    }

    protected postData<T>(url: string, data: any, headers?: { [name: string]: string }): Observable<PlanetaKinoV2JsonResponse<T>> {
        headers = Object.assign({}, headers, {
            "Content-Type": "application/json"
        });
        let options: RequestOptionsArgs = {
            headers: new Headers(headers),
            responseType: ResponseContentType.Json,
        };

        return this.startWithAuthToken().switchMap(authToken => {
            if (!_.isEmpty(authToken))
                options.headers.append("Auth-Token", authToken);

            return super.postData<PlanetaKinoV2JsonResponse<T>>(url, data, options)
                .map(res => {
                    if (res.code == "1") {
                        return res;
                    } else {
                        throw res;
                    }
                });
        });
    }

    protected startWithAuthToken() {
        return this.store.select(selectors.getAccountAuthToken).first();
    }
}