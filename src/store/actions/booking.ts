import { Action } from '@ngrx/store';
import { type } from './../util';

export const ActionTypes = {
    SELECT_SHOWTIME: type("[Booking] Select Showtime"),
};

export class SelectShowtimeAction implements Action {
    readonly type = ActionTypes.SELECT_SHOWTIME;

    /**
     * 
     * @param payload The showtime id
     */
    constructor(public payload: string) { }
}

export type Actions
    = SelectShowtimeAction;