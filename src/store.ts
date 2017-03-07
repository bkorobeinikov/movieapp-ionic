
import { createStore, combineReducers } from 'redux';

import dataReducer from './data/reducer';

export interface IStore {
    data: IData
}

const appReducer = combineReducers<IStore>({
    data: dataReducer
});

const currentMovies: IMovie[] = [
    {
        id: "0",
        name: "Logan",
        poster: "https://planetakino.ua/f/1/movies/logan/logan_new_poster-big.jpg",
        inCinema: true,

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
        inCinema: true,

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
        inCinema: true,

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

var futureMovies: IMovie[] = [
    {
        id: "21",
        name: "Personal Shopper",
        poster: "https://planetakino.ua/f/1/movies/personal_shopper/personal-shopper-poster1-big.jpg",
        inCinema: true,
        duration: 145,
        services: null,
        screening: null,
    },
    {
        id: "22",
        name: "Personal Shopper",
        poster: "https://planetakino.ua/f/1/movies/personal_shopper/personal-shopper-poster1-big.jpg",
        inCinema: true,
        duration: 145,
        services: null,
        screening: null,
    },
    {
        id: "23",
        name: "Personal Shopper",
        poster: "https://planetakino.ua/f/1/movies/personal_shopper/personal-shopper-poster1-big.jpg",
        inCinema: true,
        duration: 145,
        services: null,
        screening: null,
    },
    {
        id: "24",
        name: "Personal Shopper",
        poster: "https://planetakino.ua/f/1/movies/personal_shopper/personal-shopper-poster1-big.jpg",
        inCinema: true,
        duration: 145,
        services: null,
        screening: null,
    }
]

var movies = currentMovies.concat(futureMovies);

const initialStore = {
    data: {
        user: {id: 0, name: 'name'},
        movies: movies
    }
};

const store = createStore<IStore>(appReducer, initialStore);

// store structure
// - store
//   - data
//     - user: {}
//     - movies: []
//   - services

export default store;
