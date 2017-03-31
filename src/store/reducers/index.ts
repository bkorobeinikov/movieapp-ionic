import { compose } from '@ngrx/core/compose';
import { combineReducers, ActionReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { localStorageSync } from 'ngrx-store-localstorage';

import * as fromMovie from './movie';
import * as fromUi from './ui';
import * as fromCinema from './cinema';
import * as fromBooking from './booking';
import * as fromTicket from './ticket';
import * as fromAccount from './account';

export interface State {
    movie: fromMovie.State,
    ui: fromUi.State,
    cinema: fromCinema.State,
    booking: fromBooking.State,
    ticket: fromTicket.State,
    account: fromAccount.State,
};

export const initialState: State = {
    movie: fromMovie.initialState,
    ui: fromUi.initialState,
    cinema: fromCinema.initialState,
    booking: fromBooking.initialState,
    ticket: fromTicket.initialState,
    account: fromAccount.initialState,
};

const reducers = {
    movie: fromMovie.reducer,
    ui: fromUi.reducer,
    cinema: fromCinema.reducer,
    booking: fromBooking.reducer,
    ticket: fromTicket.reducer,
    account: fromAccount.reducer,
};

const withLocalStorage = localStorageSync(["movie", "cinema", "ticket", "account"], true);
const devReducer: ActionReducer<State> = compose(withLocalStorage, storeFreeze, combineReducers)(reducers);
const prodReducer: ActionReducer<State> = compose(withLocalStorage, combineReducers)(reducers);

export function reducer(state: State, action: any) {
    const production = false;

    if (production)
        return prodReducer(state, action);
    else
        return devReducer(state, action);
}