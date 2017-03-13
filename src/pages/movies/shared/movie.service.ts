import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Movie } from './movie.model';

@Injectable()
export class MovieService {

    constructor(private http: Http) {

    }

    getMovies(): Movie[] {
        return currentMovies.concat(futureMovies);
    }

}

const currentMovies: Movie[] = [ 
    { 
        id: "0", 
        name: "Logan", 
        poster: "https://planetakino.ua/f/1/movies/logan/logan_new_poster-big.jpg", 
 
        genres: ['Action', 'Adventure'], 
 
        duration: 145, 
        services: [ 
            { 
                type: 'imdb', 
                rating: "8.9", 
            } 
        ], 
        screening: [ 
            { 
                type: "general", 
                time: new Date(2017, 2, 7, 9, 0).toJSON(), 
            }, 
            { 
                type: "general", 
                time: new Date(2017, 2, 7, 10, 20).toJSON(), 
            }, 
            { 
                type: "general", 
                time: new Date(2017, 2, 7, 11, 30).toJSON(), 
            }, 
            { 
                type: "imax3d", 
                time: new Date(2017, 2, 7, 11, 30).toJSON(), 
            }, 
            { 
                type: "imax3d", 
                time: new Date(2017, 2, 7, 14, 40).toJSON(), 
            }, 
            { 
                type: "imax", 
                time: new Date(2017, 2, 7, 16, 80).toJSON(), 
            }, 
            { 
                type: "2d", 
                time: new Date(2017, 2, 7, 21, 50).toJSON(), 
            } 
        ] 
    }, 
    { 
        id: "1", 
        name: "Gold", 
        poster: "https://planetakino.ua/f/1/movies/gold/gold-poster-big.jpg", 
 
        genres: ['Sci-Fi', 'Fiction'], 
 
        duration: 145, 
        services: [ 
            { 
                type: 'imdb', 
                rating: "8.9", 
            } 
        ], 
        screening: [ 
            { 
                type: "general", 
                time: new Date(2017, 3, 3, 19, 40).toJSON(), 
            }, 
            { 
                type: "general", 
                time: new Date(2017, 3, 3, 21, 50).toJSON(), 
            }, 
            { 
                type: "imax3d", 
                time: new Date(2017, 3, 3, 21, 50).toJSON(), 
            }, 
            { 
                type: "2d", 
                time: new Date(2017, 3, 3, 21, 50).toJSON(), 
            } 
        ] 
    }, 
    { 
        id: "2", 
        name: "Personal Shopper", 
        poster: "https://planetakino.ua/f/1/movies/personal_shopper/personal-shopper-poster1-big.jpg", 
 
        genres: ['Comedy'], 
 
        duration: 145, 
        services: [ 
            { 
                type: 'imdb', 
                rating: "8.9", 
            } 
        ], 
        screening: [ 
            { 
                type: "general", 
                time: new Date(2017, 3, 3, 19, 40).toJSON(), 
            }, 
            { 
                type: "general", 
                time: new Date(2017, 3, 3, 21, 50).toJSON(), 
            }, 
            { 
                type: "imax3d", 
                time: new Date(2017, 3, 3, 21, 50).toJSON(), 
            }, 
            { 
                type: "2d", 
                time: new Date(2017, 3, 3, 21, 50).toJSON(), 
            } 
        ] 
    } 
]; 

var futureMovies: Movie[] = [ 
    { 
        id: "31", 
        name: "A Dog", 
        poster: "https://planetakino.ua/f/1/movies/a_dogs_purpose/A_dogs_purpose-poster3-big.jpg", 
        duration: 145, 
        services: null, 
        screening: null, 
    },
    { 
        id: "32", 
        name: "A Dog", 
        poster: "https://planetakino.ua/f/1/movies/a_dogs_purpose/A_dogs_purpose-poster3-big.jpg", 
        duration: 145, 
        services: null, 
        screening: null, 
    },
    { 
        id: "33", 
        name: "A Dog", 
        poster: "https://planetakino.ua/f/1/movies/a_dogs_purpose/A_dogs_purpose-poster3-big.jpg", 
        duration: 145, 
        services: null, 
        screening: null, 
    },
]; 
