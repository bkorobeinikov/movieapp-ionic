import { compose } from '@ngrx/core/compose';
import { combineReducers, ActionReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromMovie from './movie';
import * as fromUi from './ui';
import * as fromCinema from './cinema';
import * as fromBooking from './booking';

export interface State {
    movie: fromMovie.State,
    ui: fromUi.State,
    cinema: fromCinema.State,
    booking: fromBooking.State,
};

export const initialState: State = {
    movie: fromMovie.initialState,
    ui: fromUi.initialState,
    cinema: fromCinema.initialState,
    booking: fromBooking.initialState,
};

const reducers = {
    movie: fromMovie.reducer,
    ui: fromUi.reducer,
    cinema: fromCinema.reducer,
    booking: fromBooking.reducer,
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