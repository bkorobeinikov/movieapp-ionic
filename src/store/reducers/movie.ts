import { createSelector } from 'reselect';

import * as movie from './../actions/movie';
import { Movie } from './../models';

export interface State {
    ids: string[],
    entities: { [id: string]: Movie },
    loading: boolean,

    selectedId: string;
}

export const initialState: State = {
    ids: [],
    entities: {},
    loading: false,

    selectedId: null,
};

export function reducer(state = initialState, actionRaw: movie.Actions): State {
    console.log('movie_reducer', state, actionRaw);
    switch (actionRaw.type) {
        case movie.ActionTypes.LOAD: {
            return Object.assign({}, state, {
                loading: true,
            });
        }
        case movie.ActionTypes.LOAD_SUCCESS: {
            const movies = (<movie.LoadSuccessAction>actionRaw).payload;
            const newMovies = movies.filter(m => !state.entities[m.id]);

            const newMoviesIds = newMovies.map(m => m.id);
            const newMoviesEntities = newMovies.reduce((entities: { [id: string]: Movie }, movie: Movie) => {
                return Object.assign(entities, {
                    [movie.id]: movie
                })
            }, {});

            return Object.assign({}, state, {
                ids: state.ids.concat(newMoviesIds),
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
export const getIds = (state: State) => state.ids;
export const getLoading = (state: State) => state.loading;
export const getSelectedId = (state: State) => state.selectedId;

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
    return ids.map(id => entities[id]);
});

export const getCurrent = createSelector(getAll, (movies) => {
    return movies.filter(m => !m.soon);
});

export const getFuture = createSelector(getAll, (movies) => {
    return movies.filter(m => m.soon);
});

export const getSelected = createSelector(getEntities, getSelectedId, (entities, id) => {
    return entities[id];
});