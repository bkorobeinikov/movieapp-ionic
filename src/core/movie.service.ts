import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { Movie, } from './../store/models';

import moment from 'moment';
import { BaseService } from "./base.service";

@Injectable()
export class MovieService extends BaseService {

    private moviesUrl = "http://planetakino.ua/api/movies";

    constructor(http: Http) {
        super(http);
    }

    getMovies(): Observable<Movie[]> {
        return this.getData<any>(this.moviesUrl)
            .map(res => {
                var movies: any[] = res.inTheaters.movie;
                var current = movies.map(m => this.parseMovie(m));
                movies = res.soon.movie;
                var future = movies.map(m => this.parseMovie(m, true));

                return current.concat(future);
            });
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

}