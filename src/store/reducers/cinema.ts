import { createSelector } from 'reselect';

import * as cinema from './../actions/cinema';
import { Showtime, Cinema } from './../models';
import { ScreeningsViewModel } from './../viewModels';

import * as _ from 'lodash';

export interface State {
    cinemas: { [id: string]: Cinema };
    currentCinemaId: string,

    loading: boolean,
    updates: { [cinemaId: string]: { updating: boolean, updatedAt: Date } },

    screenings: { [cinemaId: string]: ScreeningsViewModel },
}

export const initialState: State = {
    cinemas: {},
    currentCinemaId: null,

    loading: false,
    updates: {},

    screenings: {},
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
        case cinema.ActionTypes.UPDATE: {
            let action = <cinema.UpdateAction>actionRaw;

            let cinemaId = action.payload.cinemaId;
            let updates = Object.assign({}, state.updates[cinemaId], {
                updating: true,
            });

            return Object.assign({}, state, {
                updates: Object.assign({}, state.updates, {
                    [action.payload.cinemaId]: updates
                }),
            });
        }
        case cinema.ActionTypes.UPDATE_SUCCESS: {
            let action = <cinema.UpdateSuccessAction>actionRaw;

            let cinemas = action.payload.cinemas;

            let updatesState = cinemas.reduce((updates, cinema) => {
                return Object.assign({}, updates, {
                    [cinema.id]: Object.assign({}, updates[cinema.id], {
                        updating: false,
                        updatedAt: new Date(),
                    }),
                });
            }, state.updates);

            let cinemasState = cinemas.reduce((cinemas, cinema) => {
                return Object.assign({}, cinemas, {
                    [cinema.id]: cinema
                });
            }, state.cinemas);

            return Object.assign({}, state, {
                cinemas: cinemasState,
                updates: updatesState
            });
        }
        case cinema.ActionTypes.UPDATE_FAIL: {
            let action = <cinema.UpdateFailAction>actionRaw;

            let cinemaId = action.payload.cinemaId;
            let updates = Object.assign({}, state.updates[cinemaId], {
                updating: false,
            });

            return Object.assign({}, state, {
                updates: Object.assign({}, state.updates, {
                    [action.payload.cinemaId]: updates
                }),
            });
        }
        case cinema.ActionTypes.CHANGE_CURRENT: {
            let action = <cinema.ChangeCurrentAction>actionRaw;
            let newCinemaId = action.payload;

            if (state.cinemas[newCinemaId] === undefined) {
                return state;
            }

            return Object.assign({}, state, {
                currentCinemaId: newCinemaId
            });
        }
        case cinema.ActionTypes.SHOWTIME_CHECK_AND_LOAD: {
            return state;
        }
        case cinema.ActionTypes.SHOWTIME_LOAD: {
            let action = <cinema.ShowtimeLoadAction>actionRaw;
            let cinemaId = action.payload;

            return Object.assign({}, state, {
                screenings: Object.assign({}, state.screenings, {
                    [cinemaId]: {
                        movies: [],
                        showtimes: {},
                        map: {},
                        loading: true,
                        loaded: false,
                        loadedAt: null,
                    } as ScreeningsViewModel,
                }),
            });
        }
        case cinema.ActionTypes.SHOWTIME_LOAD_SUCCESS: {
            let action = <cinema.ShowtimeLoadSuccessAction>actionRaw;
            let cinemaId = action.payload.cinemaId;

            let screenings: ScreeningsViewModel = {
                movies: action.payload.moviesMap,
                showtimes: _.keyBy(action.payload.showtimes, s => s.id),
                map: _.chain(action.payload.showtimes).groupBy(s => s.movieId)
                    .mapValues((arr: Showtime[]) => arr.map(s => s.id)).value(),
                loading: false,
                loaded: true,
                loadedAt: new Date(),
            };

            return Object.assign({}, state, {
                screenings: Object.assign({}, state.screenings, {
                    [cinemaId]: screenings
                }),
            });
        }
        case cinema.ActionTypes.SHOWTIME_LOAD_FAIL: {
            let action = <cinema.ShowtimeLoadFailAction>actionRaw;
            let cinemaId = action.payload.cinemaId;

            return Object.assign({}, state, {
                screenings: Object.assign({}, state.screenings, {
                    [cinemaId]: {
                        loading: false,
                        loaded: false,
                    }
                })
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
    return entities[currentId];
});

export const getUpdates = (state: State) => state.updates;

export const getScreenings = (state: State) => state.screenings;
export const getCurrentScreenings = createSelector(getCurrentCinemaId, getScreenings, (cinemaId, screenings) => {
    return screenings[cinemaId];
});