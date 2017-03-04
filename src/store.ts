
import { createStore, combineReducers } from 'redux';

import dataReducer from './data/reducer';

export interface IStore {
    data: IData
}

const appReducer = combineReducers<IStore>({
    data: dataReducer
});

const movies: IMovie[] = [
    {
        id: "0",
        name: "Logan",
        poster: "https://planetakino.ua/f/1/movies/logan/logan_new_poster-big.jpg",
        inCinema: true,
    },
    {
        id: "1",
        name: "Gold",
        poster: "https://planetakino.ua/f/1/movies/gold/gold-poster-big.jpg",
        inCinema: true,
    },
    {
        id: "2",
        name: "Personal Shopper",
        poster: "https://planetakino.ua/f/1/movies/personal_shopper/personal-shopper-poster1-big.jpg",
        inCinema: true,
    },
    {
        id: "3",
        name: "A Dog",
        poster: "https://planetakino.ua/f/1/movies/a_dogs_purpose/A_dogs_purpose-poster3-big.jpg",
        inCinema: true,
    },
    {
        id: "4",
        name: " John Wick: Chapter Two",
        poster: "https://planetakino.ua/f/1/movies/john_wick_chapter_two/John_Wick2-poster2-big.jpg",
        inCinema: true,
    },
    {
        id: "0",
        name: "Logan",
        poster: "https://planetakino.ua/f/1/movies/logan/logan_new_poster-big.jpg",
        inCinema: false,
    },
    {
        id: "1",
        name: "Gold",
        poster: "https://planetakino.ua/f/1/movies/gold/gold-poster-big.jpg",
        inCinema: false,
    },
    {
        id: "2",
        name: "Personal Shopper",
        poster: "https://planetakino.ua/f/1/movies/personal_shopper/personal-shopper-poster1-big.jpg",
        inCinema: false,
    },
    {
        id: "3",
        name: "A Dog",
        poster: "https://planetakino.ua/f/1/movies/a_dogs_purpose/A_dogs_purpose-poster3-big.jpg",
        inCinema: false,
    },
    {
        id: "4",
        name: " John Wick: Chapter Two",
        poster: "https://planetakino.ua/f/1/movies/john_wick_chapter_two/John_Wick2-poster2-big.jpg",
        inCinema: false,
    }
];

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
