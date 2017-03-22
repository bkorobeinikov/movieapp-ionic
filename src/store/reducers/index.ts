import { compose } from '@ngrx/core/compose';
import { combineReducers, ActionReducer, Store as rxStore } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { createSelector } from 'reselect';

import * as fromMovie from './movie';
import * as fromUi from './ui';
import * as fromCinema from './cinema';

export interface State {
    movie: fromMovie.State,
    ui: fromUi.State,
    cinema: fromCinema.State,
};

export const initialState: State = {
    movie: fromMovie.initialState,
    ui: fromUi.initialState,
    cinema: fromCinema.initialState,
};
 
const reducers = {
    movie: fromMovie.reducer,
    ui: fromUi.reducer,
    cinema: fromCinema.reducer,
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

// movie state

export const getMovieState = (state: State) => state.movie;

export const getMovieEntities = createSelector(getMovieState, fromMovie.getEntities);
export const getMovieIds = createSelector(getMovieState, fromMovie.getIds);
export const getMovieLoading = createSelector(getMovieState, fromMovie.getLoading);

export const getMovieCurrent = createSelector(getMovieState, fromMovie.getCurrent);
export const getMovieFuture = createSelector(getMovieState, fromMovie.getFuture);

export const getMovieSelected = createSelector(getMovieState, fromMovie.getSelected);

// ui state

export const getUiState = (state: State) => state.ui;

export const getUiRootTabIndex = createSelector(getUiState, fromUi.getRootTabIndex);

// cinema state
export const getCinemaState = (state: State) => state.cinema;

export const getCinemaCurrentId = createSelector(getCinemaState, fromCinema.getCurrentCinemaId);
export const getCinemaCurrent = createSelector(getCinemaState, fromCinema.getCurrentCinema);
export const getCinemaCurrentShowtimes = createSelector(getCinemaState, fromCinema.getCurrentShowtimes);
export const getCinemaShowtimesLoading = createSelector(getCinemaState, fromCinema.getShowtimesLoading);

