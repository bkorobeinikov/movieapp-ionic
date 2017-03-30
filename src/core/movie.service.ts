import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { Movie, } from './../store/models';

import moment from 'moment';
import { BaseService } from "./base.service";

import { PlanetaKinoV2Service } from "./planetakino-api/planetakino-api.service";
import { PlanetaKinoV2Movie } from "./planetakino-api/models";

import * as _ from 'lodash';

@Injectable()
export class MovieService extends BaseService {

    constructor(http: Http, private planetaKinoService: PlanetaKinoV2Service) {
        super(http);
    }

    getMoviesByCity(cityId: string): Observable<{ released: Movie[], other: Movie[] }> {
        return this.planetaKinoService.getMovies({ cityId: cityId })
            .map(res => ({
                released: res.inTheaters.map(m => this.mapToMovie(m)),
                other: res.soon.map(m => this.mapToMovie(m)),
            }));
    }

    private mapToMovie(movieObj: PlanetaKinoV2Movie): Movie {

        let technologies = [];
        if (_.isString(movieObj.technologyId)) {
            technologies.push({
                id: movieObj.technologyId,
                name: movieObj.technologies
            });
        } else if (_.isArray(movieObj.technologyId)) {
            let techs = movieObj.technologies.split(",");
            movieObj.technologyId.map((id, index) => {
                technologies.push({
                    id: id,
                    name: techs[index],
                });
            });
        }

        return {
            id: movieObj.id,
            uid: movieObj.uid,
            name: movieObj.name,
            originalName: movieObj.nameOriginal,

            picture: movieObj.mainPosterUrl,
            poster: movieObj.posterUrl,
            bigPoster: movieObj.altPosterUrl,
            description: movieObj.description,

            duration: parseInt(movieObj.length),

            countries: movieObj.country.split(","),
            genres: movieObj.genre.split(","),

            sinceDate: moment(movieObj.sinceDate),
            endDate: moment(movieObj.endDate),

            language: movieObj.duplicationLang,
            ageLimit: movieObj.ageLimit,

            showtimes: movieObj["has-showtimes"] !== undefined,

            director: movieObj.director,
            cast: movieObj.stars.split(","),

            technologies: technologies,

            trailers: [{ youtubeId: movieObj["youtube-id"], previewUrl: movieObj.trailerPreviewUrl }],

            movieUrl: movieObj.movieLink,
            movieShortUrl: movieObj.movieShortLink,

            ratings: {
                imdb: {
                    rating: "8.9",
                },
            },

        };
    }
}