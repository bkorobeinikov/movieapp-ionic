import { createSelector } from 'reselect';

import * as cinema from './../actions/cinema';
import { Showtime, Cinema, CinemaMovie } from './../models';

import * as _ from 'lodash';

export interface State {
    cinemas: { [id: string]: Cinema };
    currentCinemaId: string,
    loading: boolean,

    movies: { [cinemaId: string]: CinemaMovie[] },
    showtimes: { [cinameId: string]: Showtime[] },
    showtimesLoading: boolean,
}

export const initialState: State = {
    cinemas: {},
    currentCinemaId: null,
    loading: false,

    movies: {},
    showtimes: {},
    showtimesLoading: false,
};

export function reducer(state = initialState, actionRaw: cinema.Actions): State {
    switch (actionRaw.type) {
        case cinema.ActionTypes.LOAD: {

            return Object.assign({}, state, {
                loading: true
            });
        }
        case cinema.ActionTypes.LOAD_SUCCESS: {
            let action = <cinema.LoadSuccessAction>actionRaw;
            let cinemas = action.payload.reduce((entities: { [id: string]: Cinema }, cinema) => {
                return Object.assign(entities, {
                    [cinema.id]: cinema
                });
            }, {});

            let currentCinemaId = cinemas[state.currentCinemaId]
                ? state.currentCinemaId
                : cinemas[Object.keys(cinemas)[0]].id;

            return Object.assign({}, state, {
                cinemas: cinemas,
                currentCinemaId: currentCinemaId,
                loading: false,
            });
        }
        case cinema.ActionTypes.LOAD_FAIL: {

            return Object.assign({}, state, {
                loading: false,
            });
        }
        case cinema.ActionTypes.CHANGE_CURRENT: {
            let action = <cinema.ChangeCurrentAction>actionRaw;
            var newCinemaId = action.payload;

            if (state.cinemas[newCinemaId] === undefined) {
                return state;
            }

            return Object.assign({}, state, {
                currentCinemaId: newCinemaId
            });
        }
        case cinema.ActionTypes.SHOWTIME_LOAD: {

            return Object.assign({}, state, {
                showtimesLoading: true,
            });
        }
        case cinema.ActionTypes.SHOWTIME_LOAD_SUCCESS: {
            let action = <cinema.ShowtimeLoadSuccessAction>actionRaw;

            let newMovies: { [id: string]: CinemaMovie[] } = _.chain(action.payload.moviesMap)
                .groupBy(m => m.cinemaId).value();
            let newShowtimes: { [id: string]: Showtime[] } = _.chain(action.payload.showtimes)
                .groupBy(s => s.cinemaId).value();

            return Object.assign({}, state, {
                movies: Object.assign({}, state.movies, newMovies),
                showtimes: Object.assign({}, state.showtimes, newShowtimes),
                showtimesLoading: false,
            });
        }
        case cinema.ActionTypes.SHOWTIME_LOAD_FAIL: {

            return Object.assign({}, state, {
                showtimesLoading: false
            });
        }

        default: {
            return state;
        }
    }
}

export const getCinemas = (state: State) => state.cinemas;
export const getCurrentCinemaId = (state: State) => state.currentCinemaId;
export const getCurrentCinema = createSelector(getCinemas, getCurrentCinemaId, (entities, currentId) => {
    return entities[currentId]
});

const getMovies = (state: State) => state.movies;
export const getCurrentMovies = createSelector(getCurrentCinemaId, getMovies, (cinemaId, movies) => {
    return movies[cinemaId];
})

export const getShowtimes = (state: State) => state.showtimes;
export const getShowtimesLoading = (state: State) => state.showtimesLoading;
export const getCurrentShowtimes = createSelector(getCurrentCinemaId, getShowtimes, (cinemaId, showtimes) => {
    return showtimes[cinemaId];
});
