import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/concat'
import 'rxjs/add/operator/last'

import { Cinema, Showtime, CinemaHallSeat, CinemaHall, CinemaMovie } from "../store/models";
import { Http, } from "@angular/http";

import { BaseService } from "./base.service";
import { PlanetaKinoV2Service } from "./planetakino-api/planetakino-api.service";

import moment from 'moment';

import * as _ from 'lodash';

import { PlanetaKinoV2City, PlanetaKinoTheater, PlanetaKinoV2Theater, PlanetaKinoV2Hall, PlanetaKinoV2Showtime } from "./planetakino-api/models";
import { Store } from "@ngrx/store";
import { State } from "./../store";
import * as selectors from './../store/selectors';

@Injectable()
export class CinemaService extends BaseService {

    private showtimeUrl = {
        "pk-lvov": "http://planetakino.ua/lvov/ua/showtimes/xml/",
        "pk-lvov2": "http://planetakino.ua/lvov2/ua/showtimes/xml/",
        "kiev-bloc": "http://planetakino.ua/kiev/ua/showtimes/xml/",
        "imax-kiev": "http://planetakino.ua/kiev/ua/showtimes/xml/",
        "pk-odessa2": "http://planetakino.ua/odessa2/ua/showtimes/xml/",
        "pk-odessa": "http://planetakino.ua/odessa/ua/showtimes/xml/",
        "pk-sumy": "http://planetakino.ua/sumy/ua/showtimes/xml/",
        "pk-kharkov": "http://planetakino.ua/kharkov/ua/showtimes/xml/",
        "pk-yalta": "http://planetakino.ua/yalta/ua/showtimes/xml/"
    };

    constructor(
        http: Http,
        store: Store<State>,
        private planetakinoService: PlanetaKinoV2Service, ) {
        super(http, store);
        console.log("cinema service", store);
    }

    getCinemas(): Observable<Cinema[]> {
        // horrible peace of code, api blocks multiple request
        // so just using this hack to map cities to theaters
        return Observable.forkJoin(
            this.planetakinoService.getCities(),
            this.planetakinoService.getTheatersAll())
            .map(([cities, theaters]) => {

                return cities.map(c => {
                    var theater = theaters.find(t => t.theaterName.toUpperCase() == c.__text.toUpperCase());
                    return theater != null ? this.mapToCinemaWithCityAndTheater(c, theater) : null;
                }).filter(cinema => cinema != null);

            });
    }

    getCinemasByCityGroup(cityGroupId: string): Observable<Cinema[]> {
        return this.planetakinoService.getTheaters({ cityGroupId: cityGroupId })
            .map(res => res.map(t => this.mapToCinemaWithTheater(t)));
    }

    getShowtimesByMovie(cinemaId: string, movieId: string): Observable<Showtime[]> {
        return this.startWithCinema(cinemaId).flatMap(cinema => {
            let cityId = cinema.city.id;

            return this.planetakinoService.getMovieDates({
                cityId: cityId,
                movieId: movieId
            }).flatMap((res) => {

                let requests = res.map(date => this.planetakinoService.getMovieShowtimes({
                    cityId: cityId,
                    movieId: movieId,
                    date: date
                }));

                return Observable.combineLatest(requests).last().map(res1 => {
                    return _.flatten(res1).map(s => this.mapToShowtime(cinemaId, movieId, s));
                });
            });
        }).delay(2000);
    }

    // getShowtimes(cinemaId: string): Observable<{ cinemaId: string, showtimes: Showtime[], moviesMap: CinemaMovie[] }> {
    //     return this.getData<any>(this.showtimeUrl[cinemaId])
    //         .map(res => {
    //             try {
    //                 var days: { show: any[] }[] = res.showtimes.day;
    //                 var showtimes = _.flatMap(days, d => {
    //                     if (d.show instanceof Array) {
    //                         return _.map(d.show, s => this.parseShow(s));
    //                     } else {
    //                         return this.parseShow(d.show);
    //                     }
    //                 });
    //                 var movies = _.flatMap(res.movies.movie, m => {
    //                     return this.parseCinemaMovie(cinemaId, m);
    //                 });

    //                 return {
    //                     cinemaId: cinemaId,
    //                     showtimes: showtimes,
    //                     moviesMap: movies,
    //                 };
    //             }
    //             catch (err) {
    //                 console.error(err);
    //             }
    //         });
    // }

    getHall(cityId: string, showtime: Showtime): Observable<CinemaHall> {
        return this.planetakinoService.getHall({
            cityId: cityId,
            showtimeId: showtime.id,
            cinemaId: showtime.cinemaId,
        }).map(res => {
            return this.mapToHall(res);
        });
    }

    protected startWithCinema(cinemaId): Observable<Cinema> {
        return this.store.select(selectors.getCinemaEntities)
            .first().map(cinemas => cinemas[cinemaId]);
    }

    private parseShow(showObj: any): Showtime {
        try {
            var res: Showtime = {
                id: null,
                cinemaId: showObj["_theatre-id"],
                hallId: showObj["_hall-id"],
                movieId: showObj["_movie-id"],
                techId: showObj["_technology"],
                time: moment(showObj["_full-date"])
            };
            res.id = `${res.cinemaId}_${res.hallId}_${res.movieId}_${res.techId}_${res.time.toISOString()}`;

            return res;
        }
        catch (err) {
            console.log('parseShow: failed:', err)
            throw err;
        }
    }

    private parseCinemaMovie(cinemaId: string, movieObj: any): CinemaMovie {
        return {
            cinemaId: cinemaId,
            movieId: movieObj._id,
            movieTitle: movieObj.title,
            movieStartDate: moment(movieObj["dt-start"]).toDate(),
            movieEndDate: moment(movieObj["dt-end"]).toDate(),
        }
    }

    private mapToCinemaWithCityAndTheater(c: PlanetaKinoV2City, theater: PlanetaKinoTheater): Cinema {
        return <Cinema>{
            id: theater._id,
            city: {
                id: c._id,
                groupId: c._cid,
                name: c.__text,
            },
            name: theater.theaterName,
            nameShort: theater.theaterNameShort,
            address: theater.theaterAddress,
            addressShort: theater.theaterAddressShort,
            phone: theater.phone,

            // those fields needs to be updated from .getTheaters() call
            commissionForSaleInBonus: undefined,
            vatRate: undefined,
            technologies: undefined,
        };
    }

    private mapToCinemaWithTheater(t: PlanetaKinoV2Theater) {
        return <Cinema>{
            id: t._id,
            address: t.theaterAddress,
            addressShort: undefined,
            city: undefined,
            name: t.theaterName,
            nameShort: undefined,
            phone: t.phone,
            technologies: _.keyBy(t.technology, t => t.id),
            vatRate: t.VATrate,
            commissionForSaleInBonus: t.CommissionForSaleInBonus
        };
    }

    private mapToHall(h: PlanetaKinoV2Hall): CinemaHall {
        let seats: { [seatId: string]: CinemaHallSeat } = {};

        h.seat.map(s => {
            seats[s._id] = {
                id: s._id,
                row: s._row,
                seat: s._seat,
                x: parseInt(s._x),
                y: parseInt(s._y),
                vip: false,
                available: parseInt(s._state) === 0,
                price: parseFloat(s._price),
                bonus: parseFloat(s._price) * 100,
                width: 18,
                height: 28,
            };
        });

        try {
            let seatsValues = _.values(seats);
            let minPrice = _.minBy(seatsValues, s => s.price).price;
            seatsValues.filter(s => s.price > minPrice).forEach(s => s.vip = true);
            console.log('seats', seats);
        } catch (err) {
            console.log(err);
        }

        return {
            id: h._id,
            name: h._name,
            sectorId: h._sectorId,
            bookingFee: parseFloat(h._bookingFee),
            purchaseFee: parseFloat(h._purchaseFee),
            ticketsLeftForPurchase: parseInt(h._ticketsLeftForPurchasing),
            seats: seats,
        };
    }

    private mapToShowtime(cinemaId: string, movieId: string, s: PlanetaKinoV2Showtime): Showtime {
        return {
            id: s.showtimeId,
            cinemaId: cinemaId,
            hallId: undefined,
            movieId: movieId,
            techId: s.technologyId,
            time: moment(s.time.__text)
        }
    }
}