import { createSelector } from 'reselect';

import * as movie from './../actions/movie';
import { Movie } from './../models';

import * as _ from 'lodash';

import { AsyncOperation, AsyncStatus, makeAsyncOp } from "../viewModels";

export interface State {
    entities: { [movieId: string]: Movie };

    mapMovieToCinema: {
        [cinemaId: string]: {
            releasedIds: string[]
            otherIds: string[],

            loadingOp: AsyncOperation,
        }
    };

    selectedId: string;
}

export const initialState: State = {
    entities: {},
    mapMovieToCinema: {},

    selectedId: null,
};

export function reducer(state: State = initialState, actionRaw: movie.Actions): State {
    switch (actionRaw.type) {
        case movie.ActionTypes.LOAD: {
            let action = <movie.LoadAction>actionRaw;
            let cinemaId = action.payload.cinemaId;

            return Object.assign({}, state, {
                mapMovieToCinema: Object.assign({}, state.mapMovieToCinema, {
                    [cinemaId]: Object.assign({}, state.mapMovieToCinema[cinemaId], {
                        releasedIds: [],
                        otherIds: [],
                        loadingOp: makeAsyncOp(AsyncStatus.Pending),
                    }),
                }),
            });
        }
        case movie.ActionTypes.LOAD_SUCCESS: {
            let action = <movie.LoadSuccessAction>actionRaw;

            let entities = _.flatten([action.payload.released, action.payload.other])
                .reduce((entities, movie) => {
                    return Object.assign({}, entities, {
                        [movie.id]: movie,
                    });
                }, state.entities);

            let map = {
                releasedIds: action.payload.released.map(m => m.id),
                otherIds: action.payload.other.map(m => m.id),
                loadingOp: makeAsyncOp(AsyncStatus.Success),
            };

            return Object.assign({}, state, {
                entities: entities,
                mapMovieToCinema: Object.assign({}, state.mapMovieToCinema, {
                    [action.payload.cinemaId]: map
                }),
            });
        }
        case movie.ActionTypes.LOAD_FAIL: {
            let action = <movie.LoadFailAction>actionRaw;
            let cinemaId = action.payload.cinemaId;

            return Object.assign({}, state, {
                mapMovieToCinema: Object.assign({}, state.mapMovieToCinema, {
                    [cinemaId]: Object.assign({}, state.mapMovieToCinema[cinemaId], {
                        loadingOp: makeAsyncOp(AsyncStatus.Fail, action.payload.errorMessage),
                    }),
                }),
            });
        }
        case movie.ActionTypes.SELECT: {
            var action = <movie.SelectAction>actionRaw;
            return Object.assign({}, state, {
                selectedId: action.payload,
            });
        }

        default:
            return state;
    }
}

export const getEntities = (state: State) => state.entities;
export const getMapToCinema = (state: State) => state.mapMovieToCinema;
export const getSelectedId = (state: State) => state.selectedId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, id) => {
    return entities[id];
});