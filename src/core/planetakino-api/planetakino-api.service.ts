import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

import { Http, RequestOptionsArgs, Headers, URLSearchParams } from "@angular/http";

import { BaseService } from "./../base.service";

import { PlanetaKinoV2City, PlanetaKinoV2Movie, PlanetaKinoV2Theater, PlanetaKinoTheater, PlanetaKinoV2Hall, PlanetaKinoV2Showtime } from './models';

import moment from 'moment';

import * as _ from 'lodash';

@Injectable()
export class PlanetaKinoV2Service extends BaseService {

    private baseUrl = "http://cabinet.planetakino.ua/mapi/2";
    private citiesUrl = "/cities";
    private moviesUrl = "/movies";
    private theatersUrl = "/theaters";
    private hallSchemeUrl = "/hall-scheme";
    private movieDatesUrl = "/movie-dates";
    private showtimesUrl = "/showtimes";

    private theatersAllUrl = "http://planetakino.ua/api/theatres";

    constructor(http: Http) {
        super(http);
    }

    getCities(): Observable<PlanetaKinoV2City[]> {
        return this.getData<any>(this.citiesUrl).map(res => {
            let data = res.cities.city;
            return data;
        });
    }

    getMovies(data: { cityId: string }): Observable<{ inTheaters: PlanetaKinoV2Movie[], soon: PlanetaKinoV2Movie[] }> {
        let options = this.buildOptions(data.cityId);
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
        let options = this.buildOptions(data.cityGroupId);
        options.search = this.buildParams({
            cityId: data.cityGroupId,
        });
        return this.getData<any>(this.theatersUrl, options).map(res => {
            return res.theatres.theatre;
        });
    }

    getHall(data: { cityId: string, showtimeId: string, cinemaId: string }): Observable<PlanetaKinoV2Hall> {
        let options = this.buildOptions(data.cityId);
        options.search = this.buildParams({
            showtimeId: data.showtimeId,
            theaterId: data.cinemaId,
        });
        return this.getData<any>(this.hallSchemeUrl, options).map(res => {
            return res.hall;
        });
    }

    getMovieDates(data: { movieId: string, cityId: string }): Observable<Date[]> {
        let options = this.buildOptions(data.cityId);
        options.search = this.buildParams({
            movieId: data.movieId,
            cityId: data.cityId,
        });

        return this.getData<any>(this.movieDatesUrl, options).map(res => {
            return res.showDates.showDate.map(d => moment(d).toDate());
        });
    }

    getMovieShowtimes(data: { movieId: string, cityId: string, date: Date}) : Observable<PlanetaKinoV2Showtime[]> {
        let options = this.buildOptions(data.cityId);
        options.search = this.buildParams({
            movieId: data.movieId,
            cityId: data.cityId,
            date: moment(data.date).format("YYYY-MM-DD"),
        });

        return this.getData<any>(this.showtimesUrl, options).map(res => {
            return res.theaters.theater.showtimes.showtime;
        });
    }

    protected buildOptions(cityId: string): RequestOptionsArgs {
        return {
            headers: new Headers({ ["cityId"]: cityId })
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
        return super.getData<T>(super.joinUrl(this.baseUrl, url), options).map(res => {
            console.log('planetakino-api:', url, res);
            return res;
        });
    }
}