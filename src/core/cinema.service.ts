import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/concat'
import 'rxjs/add/operator/last'

import { Cinema, Showtime, CinemaHall, Movie } from "../store/models";
import { Http, } from "@angular/http";

import { BaseService } from "./base.service";
import { PlanetaKinoV2Service } from "./planetakino-api/planetakino-api.service";

import * as _ from 'lodash';

import { Store } from "@ngrx/store";
import { State } from "./../store";
import * as selectors from './../store/selectors';

import { Mapper } from './mapper';

@Injectable()
export class CinemaService extends BaseService {

    constructor(
        http: Http,
        private store: Store<State>,
        private planetaKinoService: PlanetaKinoV2Service, ) {
        super(http);
    }

    getCinemas(): Observable<Cinema[]> {
        // horrible peace of code, api blocks multiple request
        // so just using this hack to map cities to theaters
        return Observable.forkJoin(
            this.planetaKinoService.getCities(),
            this.planetaKinoService.getTheatersAll())
            .map(([cities, theaters]) => {

                return cities.map(c => {
                    var theater = theaters.find(t => t.theaterName.toUpperCase() == c.__text.toUpperCase());
                    return theater != null ? Mapper.mapToCinemaWithCityAndTheater(c, theater) : null;
                }).filter(cinema => cinema != null);

            });
    }

    getCinemasByCityGroup(cityGroupId: string): Observable<Cinema[]> {
        return this.planetaKinoService.getTheaters({ cityGroupId: cityGroupId })
            .map(res => res.map(t => Mapper.mapToCinemaWithTheater(t)));
    }

    getShowtimesByMovie(cinemaId: string, movieId: string): Observable<Showtime[]> {
        return this.startWithCinema(cinemaId).flatMap(cinema => {
            let cityId = cinema.city.id;

            return this.planetaKinoService.getMovieDates({
                cityId: cityId,
                movieId: movieId
            }).flatMap((res) => {

                let requests = res.map(date => this.planetaKinoService.getMovieShowtimes({
                    cityId: cityId,
                    movieId: movieId,
                    date: date
                }));

                return Observable.combineLatest(requests).last().map(res1 => {
                    return _.flatten(res1).map(s => Mapper.mapToShowtime(cinemaId, movieId, s));
                });
            });
        });
    }

    getHall(cityId: string, showtime: Showtime): Observable<CinemaHall> {
        return this.planetaKinoService.getHall({
            cityId: cityId,
            showtimeId: showtime.id,
            cinemaId: showtime.cinemaId,
        }).map(res => {
            return Mapper.mapToHall(res);
        });
    }

    getMoviesByCity(cityId: string): Observable<{ released: Movie[], other: Movie[] }> {
        return this.planetaKinoService.getMovies({ cityId: cityId })
            .map(res => ({
                released: res.inTheaters.map(m => Mapper.mapToMovie(m)),
                other: res.soon.map(m => Mapper.mapToMovie(m)),
            }));
    }

    protected startWithCinema(cinemaId): Observable<Cinema> {
        return this.store.select(selectors.getCinemaEntities)
            .first().map(cinemas => cinemas[cinemaId]);
    }
}