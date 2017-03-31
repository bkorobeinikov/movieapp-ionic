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
import { State } from "../../store";

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

    private theatersAllUrl = "http://planetakino.ua/api/theatres";

    constructor(
        http: Http,
        store: Store<State>) {
        super(http, store);
    }

    getCities(): Observable<PlanetaKinoV2City[]> {
        return this.getData<any>(this.citiesUrl).map(res => {
            let data = res.cities.city;
            return data;
        });
    }

    getMovies(data: { cityId: string }): Observable<{ inTheaters: PlanetaKinoV2Movie[], soon: PlanetaKinoV2Movie[] }> {
        let options = this.buildOptionsCityId(data.cityId);
        options.search = this.buildParams(data);
        return this.getData<any>(this.moviesUrl, options).map(res => {
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
        let options = this.buildOptionsCityId(data.cityGroupId);
        options.search = this.buildParams({
            cityId: data.cityGroupId,
        });
        return this.getData<any>(this.theatersUrl, options).map(res => {
            return res.theatres.theatre;
        });
    }

    getHall(data: { cityId: string, showtimeId: string, cinemaId: string }): Observable<PlanetaKinoV2Hall> {
        let options = this.buildOptionsCityId(data.cityId);
        options.search = this.buildParams({
            showtimeId: data.showtimeId,
            theaterId: data.cinemaId,
        });
        return this.getData<any>(this.hallSchemeUrl, options).map(res => {
            return res.hall;
        });
    }

    getMovieDates(data: { movieId: string, cityId: string }): Observable<Date[]> {
        let options = this.buildOptionsCityId(data.cityId);
        options.search = this.buildParams({
            movieId: data.movieId,
            cityId: data.cityId,
        });

        return this.getData<any>(this.movieDatesUrl, options).map(res => {
            return res.showDates.showDate.map(d => moment(d).toDate());
        });
    }

    getMovieShowtimes(data: { movieId: string, cityId: string, date: Date }): Observable<PlanetaKinoV2Showtime[]> {
        let options = this.buildOptionsCityId(data.cityId);
        options.search = this.buildParams({
            movieId: data.movieId,
            cityId: data.cityId,
            date: moment(data.date).format("YYYY-MM-DD"),
        });

        return this.getData<any>(this.showtimesUrl, options).map(res => {
            return res.theaters.theater.showtimes.showtime;
        });
    }

    login(data: { login: string, password: string }): Observable<PlanetaKinoV2JsonResponse<PlanetaKinoV2Login>> {
        return this.postData<PlanetaKinoV2Login>(this.loginUrl, {
            login: data.login,
            password: data.password,
        });
    }

    getProfile(): Observable<PlanetaKinoV2JsonResponse<PlanetaKinoV2Profile>> {
        return this.postData<PlanetaKinoV2Profile>(this.profileUrl, { ticketsinfo: "y" });
    }

    protected buildOptionsCityId(cityId: string): RequestOptionsArgs {
        return this.buildOptions({ cityId: cityId });
    }

    protected buildOptions(headers: { [name: string]: any }): RequestOptionsArgs {
        return {
            headers: new Headers(headers)
        };
    }

    protected buildParams(params: any): URLSearchParams {
        let res = new URLSearchParams();
        Object.keys(params).forEach(key => {
            res.set(key, params[key]);
        });
        return res;
    }

    protected getData<T>(url: string, options?: RequestOptionsArgs): Observable<T> {
        return super.getData<T>(url, options).map(res => {
            console.log('planetakino-api:', url, res);
            return res;
        });
    }

    protected postData<T>(url: string, data: any, options?: RequestOptionsArgs): Observable<PlanetaKinoV2JsonResponse<T>> {
        if (options == null)
            options = this.buildOptions({});
        options.headers.append("Content-Type", "application/json");
        options.responseType = ResponseContentType.Json;
        return super.postData<PlanetaKinoV2JsonResponse<T>>(url, data, options)
            .map(res => {
                if (res.code == "1") {
                    return res;
                } else {
                    return Observable.throw(res);
                }
            });
    }
}