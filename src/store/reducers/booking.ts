import { createSelector } from 'reselect';

import * as booking from './../actions/booking';
import * as _ from 'lodash';

import { CinemaHall } from './../models';

export interface State {
    showtimeId: string;

    hallLoading: boolean;
    hall: CinemaHall;

    seatIds: string[];
}

export const initialState: State = {
    showtimeId: null,

    hallLoading: false,
    hall: null,

    seatIds: [],
};

export function reducer(state = initialState, actionRaw: booking.Actions) {
    switch (actionRaw.type) {
        case booking.ActionTypes.SELECT_SHOWTIME: {
            let action = <booking.SelectShowtimeAction>actionRaw;
            let showtime = action.payload;
            let showtimeId = showtime != null ? showtime.id : null;

            if (state.showtimeId == showtimeId)
                return state;

            return Object.assign({}, state, {
                showtimeId: showtimeId,

                hallLoading: false,
                hall: null,
                seatIds: [],
            });
        }
        case booking.ActionTypes.HALL_LOAD: {

            return Object.assign({}, state, {
                hallLoading: true,
                hall: null,
                seatIds: [],
            });
        }
        case booking.ActionTypes.HALL_LOAD_SUCCESS: {
            let action = <booking.HallLoadSuccessAction>actionRaw;
            return Object.assign({}, state, {
                hallLoading: false,
                hall: action.payload,
                seatIds: [],
            })
        }
        case booking.ActionTypes.HALL_LOAD_FAIL: {
            return Object.assign({}, state, {
                hallLoading: false,
            });
        }
        case booking.ActionTypes.SEAT_TOGGLE: {
            let action = <booking.SeatToggleAction>actionRaw;
            let seatId = action.payload;

            let newSeatIds = _.clone(state.seatIds);

            let exists = state.seatIds.indexOf(seatId);
            if (exists > -1)
                newSeatIds.splice(exists, 1);
            else
                newSeatIds.push(seatId);

            return Object.assign({}, state, {
                seatIds: newSeatIds,
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

export const getSeatIds = (state: State) => state.seatIds;
export const getSeats = createSelector(getHall, getSeatIds, (hall, seatIds) => {
    if (hall == null)
        return [];
        
    return hall.seats.filter(s => seatIds.indexOf(s.id) > -1);
});