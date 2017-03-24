import { createSelector } from 'reselect';

import * as movie from './../actions/movie';
import { Movie } from './../models';

import * as _ from 'lodash';

export interface State {
    entities: { [movieId: string]: Movie },
    loading: boolean,

    selectedId: string;
}

export const initialState: State = {
    entities: {},
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
            const movies = (<movie.LoadSuccessAction>actionRaw).payload;
            const newMovies = movies.filter(m => !state.entities[m.id]);

            const newMoviesEntities: { [movieId: string]: Movie } = _.keyBy(newMovies, m => m.id);

            return Object.assign({}, state, {
                entities: Object.assign({}, state.entities, newMoviesEntities),
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
export const getLoading = (state: State) => state.loading;
export const getSelectedId = (state: State) => state.selectedId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, id) => {
    return entities[id];
});