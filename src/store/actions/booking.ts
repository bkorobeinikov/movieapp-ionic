import { Action } from '@ngrx/store';
import { type } from './../util';

import { CinemaHall, Showtime } from './../models';

export const ActionTypes = {
    SELECT_SHOWTIME: type("[Booking] Select Showtime"),

    HALL_LOAD: type("[Booking] Hall Load"),
    HALL_LOAD_SUCCESS: type("[Booking] Hall Load Success"),
    HALL_LOAD_FAIL: type("[Booking] Hall Load Fail"),

    SEAT_TOGGLE: type("[Booking] Seat Toggle"),

    CLEAR: type("[Booking] Clear"),
};

export class SelectShowtimeAction implements Action {
    readonly type = ActionTypes.SELECT_SHOWTIME;

    /**
     * 
     * @param payload The showtime id
     */
    constructor(public payload: Showtime) { }
}

export class HallLoadAction implements Action {
    readonly type = ActionTypes.HALL_LOAD;

    constructor(public payload: Showtime) { }
}

export class HallLoadSuccessAction implements Action {
    readonly type = ActionTypes.HALL_LOAD_SUCCESS;

    constructor(public payload: CinemaHall) { }
}

export class HallLoadFailAction implements Action {
    readonly type = ActionTypes.HALL_LOAD_FAIL;

    constructor(public payload: { message: string }) { }
}

export class SeatToggleAction implements Action {
    readonly type = ActionTypes.SEAT_TOGGLE;

    /**
     * 
     * @param payload seat id
     */
    constructor(public payload: string) { }
}

export class ClearAction implements Action {
    readonly type = ActionTypes.CLEAR;

    constructor() { }
}

export type Actions
    = SelectShowtimeAction
    | HallLoadAction
    | HallLoadSuccessAction
    | HallLoadFailAction
    | SeatToggleAction
    | ClearAction;