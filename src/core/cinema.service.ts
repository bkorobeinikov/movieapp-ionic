import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

import { Cinema, Showtime } from "../store/models";
import { Http, Headers, Response } from "@angular/http";

import { BaseService } from "./base.service";

import moment from 'moment';

import * as _ from 'lodash';

@Injectable()
export class CinemaService extends BaseService {

    private cinemaListUrl = "http://planetakino.ua/api/theatres";
    private showtimeUrl = {
        "pk-lvov": "http://planetakino.ua/lvov/ua/showtimes/xml/",
        "pk-lvov2": "http://planetakino.ua/lvov2/ua/showtimes/xml/",
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

    getShowtimes(cinemaId: string): Observable<Showtime[]> {
        return this.getData<any>(this.showtimeUrl[cinemaId])
            .map(res => {
                try {
                    var days: { show: any[] }[] = res.showtimes.day;
                    return _.flatMap(days, d => {
                        if (d.show instanceof Array) {
                            return _.map(d.show, s => this.parseShow(s));
                        } else {
                            return this.parseShow(d.show);
                        }
                    });
                }
                catch (err) {
                    console.error(err);
                }
            });
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

    private parseShow(showObj: any) {
        try {
            var res: Showtime = {
                cinemaId: showObj["_theatre-id"],
                hallId: showObj["_hall-id"],
                movieId: showObj["_movie-id"],
                techId: showObj["_technology"],
                time: moment(showObj["_full-date"])
            };

            return res;
        }
        catch (err) {
            console.log('parseShow: failed:', err)
            throw err;
        }
    }
}