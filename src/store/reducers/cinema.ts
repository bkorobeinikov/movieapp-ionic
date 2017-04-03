import { createSelector } from 'reselect';

import * as cinema from './../actions/cinema';
import { Cinema } from './../models';
import { ScreeningsViewModel } from './../viewModels';
import { AsyncOperation, AsyncStatus, defaultAsyncOp, makeAsyncOp } from './../viewModels';

import * as _ from 'lodash';


export interface State {
    cinemas: { [id: string]: Cinema };
    currentCinemaId: string;

    loadingOp: AsyncOperation;
    updates: { [cinemaId: string]: AsyncOperation },

    screenings: { [cinemaId: string]: { [movieId: string]: ScreeningsViewModel } },
}

export const initialState: State = {
    cinemas: {},
    currentCinemaId: null,

    loadingOp: defaultAsyncOp(),
    updates: {},

    screenings: {},
};

export function reducer(state: State = initialState, actionRaw: cinema.Actions): State {
    switch (actionRaw.type) {
        case cinema.ActionTypes.LOAD: {

            return Object.assign({}, state, {
                loadingOp: makeAsyncOp(AsyncStatus.Pending),
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
                loadingOp: makeAsyncOp(AsyncStatus.Success),
            });
        }
        case cinema.ActionTypes.LOAD_FAIL: {
            let action = <cinema.LoadFailAction>actionRaw;

            return Object.assign({}, state, {
                loadingOp: makeAsyncOp(AsyncStatus.Fail, action.payload.errorMessage)
            });
        }
        case cinema.ActionTypes.UPDATE: {
            let action = <cinema.UpdateAction>actionRaw;
            let cinemaId = action.payload.cinemaId;

            return Object.assign({}, state, {
                updates: Object.assign({}, state.updates, {
                    [cinemaId]: makeAsyncOp(AsyncStatus.Pending),
                }),
            });
        }
        case cinema.ActionTypes.UPDATE_SUCCESS: {
            let action = <cinema.UpdateSuccessAction>actionRaw;

            let cinemas = action.payload.cinemas;

            let updatesState = cinemas.reduce((updates, cinema) => {
                return Object.assign({}, updates, {
                    [cinema.id]: makeAsyncOp(AsyncStatus.Success),
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

            return Object.assign({}, state, {
                updates: Object.assign({}, state.updates, {
                    [cinemaId]: makeAsyncOp(AsyncStatus.Fail, action.payload.errorMessage),
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
            let cinemaId = action.payload.cinemaId;
            let movieId = action.payload.movieId;

            return Object.assign({}, state, {
                screenings: Object.assign({}, state.screenings, {
                    [cinemaId]: Object.assign({}, state.screenings[cinemaId], {
                        [movieId]: <ScreeningsViewModel>{
                            loadingOp: makeAsyncOp(AsyncStatus.Pending),
                        },
                    }),
                }),
            });
        }
        case cinema.ActionTypes.SHOWTIME_LOAD_SUCCESS: {
            let action = <cinema.ShowtimeLoadSuccessAction>actionRaw;
            let cinemaId = action.payload.cinemaId;
            let movieId = action.payload.movieId;

            let screenings: ScreeningsViewModel = {
                showtimes: _.keyBy(action.payload.showtimes, s => s.id),
                loadingOp: makeAsyncOp(AsyncStatus.Success),
            };

            return Object.assign({}, state, {
                screenings: Object.assign({}, state.screenings, {
                    [cinemaId]: Object.assign({}, state.screenings[cinemaId], {
                        [movieId]: screenings
                    }),
                }),
            });
        }
        case cinema.ActionTypes.SHOWTIME_LOAD_FAIL: {
            let action = <cinema.ShowtimeLoadFailAction>actionRaw;
            let cinemaId = action.payload.cinemaId;
            let movieId = action.payload.movieId;

            return Object.assign({}, state, {
                screenings: Object.assign({}, state.screenings, {
                    [cinemaId]: Object.assign({}, state, state.screenings[cinemaId], {
                        [movieId]: {
                            loadingOp: makeAsyncOp(AsyncStatus.Fail, action.payload.errorMessage),
                        },
                    }),
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

export const getAllScreeningEntities = (state: State) => state.screenings;
export const getCurrentCinemaShowtimes = createSelector(getCurrentCinemaId, getAllScreeningEntities, (cinemaId, screenings) => {
    return screenings[cinemaId];
});

export const getLoadingOp = (state: State) => state.loadingOp;