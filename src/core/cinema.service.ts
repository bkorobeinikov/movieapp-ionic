import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

import { Cinema, Showtime, CinemaHallSeat, CinemaHall, CinemaMovie } from "../store/models";
import { Http, } from "@angular/http";

import { BaseService } from "./base.service";

import moment from 'moment';

import * as _ from 'lodash';

@Injectable()
export class CinemaService extends BaseService {

    private cinemaListUrl = "http://planetakino.ua/api/theatres";
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

    constructor(http: Http) {
        super(http);
    }

    getCinemas(): Observable<Cinema[]> {
        return this.getData<any>(this.cinemaListUrl)
            .map(res => {
                var cinemas: any[] = res.theatres.theatre;

                return cinemas.map(v => this.parseCinema(v));
            });
    }

    getShowtimes(cinemaId: string): Observable<{ cinemaId: string, showtimes: Showtime[], moviesMap: CinemaMovie[] }> {
        return this.getData<any>(this.showtimeUrl[cinemaId])
            .map(res => {
                try {
                    var days: { show: any[] }[] = res.showtimes.day;
                    var showtimes = _.flatMap(days, d => {
                        if (d.show instanceof Array) {
                            return _.map(d.show, s => this.parseShow(s));
                        } else {
                            return this.parseShow(d.show);
                        }
                    });
                    var movies = _.flatMap(res.movies.movie, m => {
                        return this.parseCinemaMovie(cinemaId, m);
                    });

                    return {
                        cinemaId: cinemaId,
                        showtimes: showtimes,
                        moviesMap: movies,
                    };
                }
                catch (err) {
                    console.error(err);
                }
            });
    }

    getHall(showtime: Showtime): Observable<CinemaHall> {

        var seats: { [seatId: string]: CinemaHallSeat } = {};

        for (let r = 0; r < 15; r++) {
            for (let c = 0; c < 23; c++) {
                let style = {
                    width: 30,
                    height: 34,
                    marginLeft: 2,
                    marginRight: 2,
                    marginTop: 4,
                    marginBottom: 4
                };

                var seat: CinemaHallSeat = {
                    id: `${showtime.cinemaId}_${showtime.hallId}_${r + 1}_${c + 1}`,

                    x: c * (style.width + style.marginLeft + style.marginRight),
                    y: r * (style.height + style.marginBottom + style.marginTop),
                    width: style.width,
                    height: style.height,

                    row: r + 1,
                    seat: c + 1,

                    available: Math.round(Math.random() * 10) % 5 != 0,

                    price: 115,
                };
                seats[seat.id] = seat;
            }

        }

        let hall: CinemaHall = {
            id: showtime.hallId,
            name: "Hall " + showtime.hallId,
            seats: seats,
        };

        return Observable.of(hall).delay(1000);
    }

    private parseCinema(obj: any): Cinema {
        return {
            id: obj._id,
            name: obj.theaterName,
            nameShort: obj.theaterNameShort,
            address: obj.theaterAddress,
            addressShort: obj.theaterAddressShort,
            phone: obj.phone,
            city: obj.city
        };
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
}