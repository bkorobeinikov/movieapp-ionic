import { Action } from '@ngrx/store';
import { type } from './../util';

import { Showtime, Cinema } from './../models';

export const ActionTypes = {
    LOAD: type("[Cinema] Load"),
    LOAD_SUCCESS: type("[Cinema] Load Success"),
    LOAD_FAIL: type("[Cinema] Load Fail"),

    UPDATE_TRY: type("[Cinema] Update Try"),
    UPDATE: type("[Cinema] Update"),
    UPDATE_SUCCESS: type("[Cinema] Update Success"),
    UPDATE_FAIL: type("[Cinema] Update Fail"),

    CHANGE_CURRENT: type("[Cinema] Change Current"),

    SHOWTIME_CHECK_AND_LOAD: type("[Cinema] Showtime Check And Load"),
    SHOWTIME_LOAD: type("[Cinema] Showtime Load"),
    SHOWTIME_LOAD_SUCCESS: type("[Cinema] Showtime Load Success"),
    SHOWTIME_LOAD_FAIL: type("[Cinema] Showtime Load Fail"),
};

export class LoadAction implements Action {
    readonly type = ActionTypes.LOAD;

    constructor() { }
}

export class LoadSuccessAction implements Action {
    readonly type = ActionTypes.LOAD_SUCCESS;

    constructor(public payload: Cinema[]) { }
}

export class LoadFailAction implements Action {
    readonly type = ActionTypes.LOAD_FAIL;

    constructor(public payload: { errorMessage: string }) { }
}

export class UpdateTryAction implements Action {
    readonly type = ActionTypes.UPDATE_TRY;

    constructor(public payload: { cinemaId: string }) { }
}

export class UpdateAction implements Action {
    readonly type = ActionTypes.UPDATE;

    constructor(public payload: { cinemaId: string }) { }
}

export class UpdateSuccessAction implements Action {
    readonly type = ActionTypes.UPDATE_SUCCESS;

    constructor(public payload: { cinemas: Cinema[] }) { }
}

export class UpdateFailAction implements Action {
    readonly type = ActionTypes.UPDATE_FAIL;

    constructor(public payload: { cinemaId: string, errorMessage: string }) { }
}

export class ChangeCurrentAction implements Action {
    readonly type = ActionTypes.CHANGE_CURRENT;

    /**
     * 
     * @param payload cinema id
     */
    constructor(public payload: string) { }
}

export class ShowtimeCheckAndLoadAction implements Action {
    readonly type = ActionTypes.SHOWTIME_CHECK_AND_LOAD;

    /**
     * 
     * @param payload cinema id
     */
    constructor(public payload: string) { }
}

export class ShowtimeLoadAction implements Action {
    readonly type = ActionTypes.SHOWTIME_LOAD;

    constructor(public payload: {
        cinemaId: string,
        movieId: string,
    }) { }
}

export class ShowtimeLoadSuccessAction implements Action {
    readonly type = ActionTypes.SHOWTIME_LOAD_SUCCESS;

    constructor(public payload: { cinemaId: string, movieId: string, showtimes: Showtime[] }) { }
}

export class ShowtimeLoadFailAction implements Action {
    readonly type = ActionTypes.SHOWTIME_LOAD_FAIL;

    constructor(public payload: { cinemaId: string, movieId: string, errorMessage: string }) { }
}

export type Actions
    = LoadAction
    | LoadSuccessAction
    | LoadFailAction
    | UpdateAction
    | UpdateSuccessAction
    | UpdateFailAction
    | ChangeCurrentAction
    | ShowtimeCheckAndLoadAction
    | ShowtimeLoadAction
    | ShowtimeLoadSuccessAction
    | ShowtimeLoadFailAction;