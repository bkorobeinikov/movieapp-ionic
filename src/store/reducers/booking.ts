import { createSelector } from 'reselect';

import * as booking from './../actions/booking';
import * as movie from './../actions/movie';

import moment from 'moment';

import { CinemaHall } from './../models';

export interface State {
    showtimeId: string;

    hallLoading: boolean;
    hall: CinemaHall;
}

export const initialState: State = {
    showtimeId: null,

    hallLoading: false,
    hall: null,
};

export function reducer(state = initialState, actionRaw: booking.Actions) {
    switch (actionRaw.type) {
        case booking.ActionTypes.SELECT_SHOWTIME: {
            var action = <booking.SelectShowtimeAction>actionRaw;
            var showtime = action.payload;
            var showtimeId = showtime != null ? showtime.id : null;

            if (state.showtimeId == showtimeId)
                return state;

            return Object.assign({}, state, {
                showtimeId: showtimeId,

                hallLoading: false,
                hall: null,
            });
        }
        case booking.ActionTypes.HALL_LOAD: {

            return Object.assign({}, state, {
                hallLoading: true,
                hall: null
            });
        }
        case booking.ActionTypes.HALL_LOAD_SUCCESS: {
            let action = <booking.HallLoadSuccessAction>actionRaw;
            return Object.assign({}, state, {
                hallLoading: false,
                hall: action.payload,
            })
        }
        case booking.ActionTypes.HALL_LOAD_FAIL: {
            return Object.assign({}, state, {
                hallLoading: false,
                hall: null
            });
        }

        default: {
            return state;
        }
    }
}

export const getShowtimeId = (state: State) => state.showtimeId;

export const getHallLoading = (state: State) => state.hallLoading;
export const getHall = (state: State) => state.hall;