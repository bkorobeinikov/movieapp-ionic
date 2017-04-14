import { createSelector } from 'reselect';

import * as booking from './../actions/booking';
import * as _ from 'lodash';

import { CinemaHall } from './../models';

import { AsyncOperation, AsyncStatus, defaultAsyncOp, makeAsyncOp } from "./../utils";

export interface State {
    showtimeId: string;

    hallLoadingOp: AsyncOperation;
    hall: CinemaHall;

    selectedSeatIds: string[];
}

export const initialState: State = {
    showtimeId: null,

    hall: null,
    hallLoadingOp: defaultAsyncOp(),

    selectedSeatIds: [],
};

export function reducer(state = initialState, actionRaw: booking.Actions): State {
    switch (actionRaw.type) {
        case booking.ActionTypes.SELECT_SHOWTIME: {
            let action = <booking.SelectShowtimeAction>actionRaw;
            let showtime = action.payload;
            let showtimeId = showtime != null ? showtime.id : null;

            if (state.showtimeId == showtimeId)
                return state;

            return {
                ...state,
                showtimeId: showtimeId,

                hall: null,
                hallLoadingOp: makeAsyncOp(AsyncStatus.None),
                selectedSeatIds: [],
            };
        }
        case booking.ActionTypes.HALL_LOAD: {

            return {
                ...state,
                hall: null,
                hallLoadingOp: makeAsyncOp(AsyncStatus.Pending),
                selectedSeatIds: [],
            };
        }
        case booking.ActionTypes.HALL_LOAD_SUCCESS: {
            let action = <booking.HallLoadSuccessAction>actionRaw;

            let hall = action.payload;

            return {
                ...state,
                hall: hall,
                hallLoadingOp: makeAsyncOp(AsyncStatus.Success),
                selectedSeatIds: [],
            };
        }
        case booking.ActionTypes.HALL_LOAD_FAIL: {
            let action = <booking.HallLoadFailAction>actionRaw;

            return {
                ...state,
                hall: null,
                hallLoadingOp: makeAsyncOp(AsyncStatus.Fail, action.payload.message),
                selectedSeatIds: [],
            };
        }
        case booking.ActionTypes.SEAT_TOGGLE: {
            let action = <booking.SeatToggleAction>actionRaw;
            let seatId = action.payload;

            let newSeatIds = _.clone(state.selectedSeatIds);

            let exists = state.selectedSeatIds.indexOf(seatId);
            if (exists > -1)
                newSeatIds.splice(exists, 1);
            else
                newSeatIds.push(seatId);

            return {
                ...state,
                selectedSeatIds: newSeatIds,
            };
        }
        case booking.ActionTypes.CLEAR: {
            return {
                ...state,
                showtimeId: null,
                hallLoading: false,
                hall: null,
                selectedSeatIds: [],
            };
        }

        default: {
            return state;
        }
    }
}

export const getShowtimeId = (state: State) => state.showtimeId;
export const getHallLoading = (state: State) => state.hallLoadingOp.pending;
export const getHall = (state: State) => state.hall;

const getSelectedSeatIds = (state: State) => state.selectedSeatIds;
export const getSelectedSeats = createSelector(getHall, getSelectedSeatIds, (hall, seatIds) => {
    if (_.isEmpty(hall) || _.isEmpty(seatIds))
        return [];

    return seatIds.map(id => hall.seats[id]);
});