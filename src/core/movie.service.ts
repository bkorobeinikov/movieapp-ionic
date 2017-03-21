import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import X2JS from 'x2js';

import { Movie } from './movie.model';
import { MovieShowtime } from './movie-showtime.model';

import moment from 'moment';

@Injectable()
export class MovieService {

    private moviesUrl = "http://planetakino.ua/api/movies";
    private showtimeUrl = "http://planetakino.ua/lvov/ua/showtimes/xml/";
    private headers: Headers;
    private headers1: Headers;

    private showtimes: MovieShowtime[];

    constructor(private http: Http) {

        this.headers = new Headers();
        this.headers.append('Content-Type', 'text/xml');
        this.headers.append('Access-Control-Allow-Origin', '*');

        this.headers1 = new Headers();
        this.headers1.append('Content-Type', 'text/xml');
        //this.headers1.append('Access-Control-Allow-Origin', '*');
    }

    getMovies(): Observable<Movie[]> {
        var a = this.http
            .get(this.moviesUrl, {
                headers: this.headers
            })
            .map(res => {
                var x2js = new X2JS();
                var text = res.text();
                var jsonObj: any = x2js.xml2js<any>(text).response;
                console.log('response ojb1', jsonObj);

                var movies: any[] = jsonObj.inTheaters.movie;
                var current = movies.map(m => this.parseMovie(m));
                movies = jsonObj.soon.movie;
                var future = movies.map(m => this.parseMovie(m, true));

                return current.concat(future);
            })
            .catch(this.handleError);

        return a;
    }

    getShowtimes(): Observable<MovieShowtime[]> {
        if (this.showtimes != null)
            return Observable.of(this.showtimes);

        return this.getData<any>(this.showtimeUrl).map(res => {
            var days: any[] = res.showtimes.day;

            var result: MovieShowtime[] = [];

            days.forEach(d => {
                var shows: any[] = d.show;

                shows.forEach(s => {
                    result.push(this.parseShow(s));
                });
            });

            console.log('result', result);

            this.showtimes = result;

            return result;
        });
    }

    private getData<T>(url: string): Observable<T> {
        var a = this.http
            .get(url, {
                headers: this.headers1
            })
            .map(res => {
                console.log('response ojb3', res);
                var x2js = new X2JS();
                var text = res.text();
                var jsonObj: any = x2js.xml2js<any>(text)['planeta-kino'];
                console.log('response ojb2', jsonObj);

                return jsonObj;
            })
            .catch(this.handleError);

        return a;
    }

    private parseMovie(movieObj: any, soon: boolean = false): Movie {
        var result: Movie = {
            id: movieObj.id,
            name: movieObj.name,
            originalName: movieObj.nameOriginal,

            picture: movieObj.mainPosterUrl,
            poster: movieObj.posterUrl,
            description: movieObj.description,

            duration: parseInt(movieObj.length),

            countries: (<string>movieObj.country).split(","),
            genres: (<string>movieObj.genre).split(","),

            soon: soon,
            sinceDate: moment(movieObj.sinceDate),
            endDate: moment(movieObj.endDate),

            language: movieObj.duplicationLang,
            ageLimit: movieObj.ageLimit,

            showtimes: movieObj["has-showtimes"] !== undefined,

            director: movieObj.director,
            cast: (<string>movieObj.stars).split(","),

            ratings: {
                imdb: {
                    rating: "8.9",
                },
            },
        };

        return result;
    }

    private parseShow(showObj: any) {
        var res: MovieShowtime = {
            cinemaId: showObj["_theatre-id"],
            hallId: showObj["_hall-id"],
            movieId: showObj["_movie-id"],
            techId: showObj["_technology"],
            time: moment(showObj["_full-date"])
        };

        return res;
    }

    private handleError(error: Response | any) {
        console.error(error);
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}