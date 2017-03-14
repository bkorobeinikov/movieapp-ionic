import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import X2JS from 'x2js';

import { Movie } from './movie.model';

import moment from 'moment';

@Injectable()
export class MovieService {

    private moviesUrl = "http://planetakino.ua/api/movies";
    private headers: Headers;

    constructor(private http: Http) {

        this.headers = new Headers();
        this.headers.append('Content-Type', 'text/xml');
        this.headers.append('Access-Control-Allow-Origin', '*');
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
                console.log('response ojb', jsonObj);

                var movies: any[] = jsonObj.inTheaters.movie;
                var current = movies.map(m => this.parseMovie(m));
                movies = jsonObj.soon.movie;
                var future = movies.map(m => this.parseMovie(m, true));

                return current.concat(future);
            })
            .catch(this.handleError);

        return a;
    }

    private parseMovie(movieObj: any, soon: boolean = false): Movie {
        return {
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

            ratings: {
                imdb: {
                    rating: "8.9",
                },
            },
        };
    }

    private handleError(error: Response | any) {
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