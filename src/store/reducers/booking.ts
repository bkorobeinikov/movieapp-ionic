import { createSelector } from 'reselect';

import * as booking from './../actions/booking';
import * as movie from './../actions/movie';

import moment from 'moment';

export interface State {
    showtimeId: string;
}

export const initialState: State = {
    showtimeId: null,
};

export function reducer(state: State, actionRaw: booking.Actions | movie.SelectAction) {
    switch (actionRaw.type) {
        case booking.ActionTypes.SELECT_SHOWTIME: {
            var action = <booking.SelectShowtimeAction>actionRaw;

            return Object.assign({}, state, {
                showtimeId: action.payload
            });
        }

        default: {
            return state;
        }
    }
} 

export const getShowtimeId = (state: State) => state.showtimeId;