import { createSelector } from 'reselect';

import * as movie from './../actions/movie';
import { Movie } from './../models';

import * as _ from 'lodash';

export interface State {
    entities: { [movieId: string]: Movie };
    //mapUidToId: { [uid: string]: string };

    mapMovieToCinema: {
        [cinemaId: string]: {
            releasedIds: string[]
            otherIds: string[]
        }
    };

    loading: boolean;

    selectedId: string;
}

export const initialState: State = {
    entities: {},
    //mapUidToId: {},
    mapMovieToCinema: {},

    loading: false,

    selectedId: null,
};

export function reducer(state = initialState, actionRaw: movie.Actions): State {
    switch (actionRaw.type) {
        case movie.ActionTypes.LOAD: {
            return Object.assign({}, state, {
                loading: true,
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
            // let mapUidToId = _.flatten([action.payload.released, action.payload.other])
            //     .reduce((map, movie) => {
            //         return Object.assign({}, entities, {
            //             [movie.uid]: movie.id
            //         });
            //     }, state.mapUidToId);

            let map = {
                releasedIds: action.payload.released.map(m => m.id),
                otherIds: action.payload.other.map(m => m.id),
            };

            return Object.assign({}, state, {
                entities: entities,
                //mapUidToId: mapUidToId,
                mapMovieToCinema: Object.assign({}, state.mapMovieToCinema, {
                    [action.payload.cinemaId]: map
                }),
                loading: false,
            });
        }
        case movie.ActionTypes.LOAD_FAIL: {
            return Object.assign({}, state, {
                loading: false,
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
export const getLoading = (state: State) => state.loading;
export const getSelectedId = (state: State) => state.selectedId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, id) => {
    return entities[id];
});