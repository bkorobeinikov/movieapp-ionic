import { compose } from '@ngrx/core/compose';
import { combineReducers, ActionReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { createSelector } from 'reselect';

import * as fromMovie from './movie';

export interface State {
    movie: fromMovie.State,
};

export const initialState: State = {
    movie: fromMovie.initialState
};
 
const reducers = {
    movie: fromMovie.reducer
};

const devReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
const prodReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: State, action: any) {
    const production = false;

    if (production)
        return prodReducer(state, action);
    else
        return devReducer(state, action);
}

export const getMovieState = (state: State) => state.movie;

export const getMovieEntities = createSelector(getMovieState, fromMovie.getEntities);
export const getMovieIds = createSelector(getMovieState, fromMovie.getIds);
export const getMovieLoading = createSelector(getMovieState, fromMovie.getLoading);

export const getMovieCurrent = createSelector(getMovieState, fromMovie.getCurrent);
export const getMovieFuture = createSelector(getMovieState, fromMovie.getFuture);

