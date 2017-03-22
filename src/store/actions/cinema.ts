import { Action } from '@ngrx/store';
import { type } from './../util';

import { Showtime, Cinema } from './../models';

export const ActionTypes = {
    LOAD: type("[Cinema] Load"),
    LOAD_SUCCESS: type("[Cinema] Load Success"),
    LOAD_FAIL: type("[Cinema] Load Fail"),

    CHANGE_CURRENT: type("[Cinema] Change Current"),

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

    constructor(public payload: any) { }
}

export class ChangeCurrentAction implements Action {
    readonly type = ActionTypes.CHANGE_CURRENT;

    constructor(public payload: string) { }
}

export class ShowtimeLoadAction implements Action {
    readonly type = ActionTypes.SHOWTIME_LOAD;

    constructor(public payload: string) { }
}

export class ShowtimeLoadSuccessAction implements Action {
    readonly type = ActionTypes.SHOWTIME_LOAD_SUCCESS;

    constructor(public payload: Showtime[]) { }
}

export class ShowtimeLoadFailAction implements Action {
    readonly type = ActionTypes.SHOWTIME_LOAD_FAIL;

    constructor(public payload: any) { }
}

export type Actions
    = LoadAction
    | LoadSuccessAction
    | LoadFailAction
    | ChangeCurrentAction
    | ShowtimeLoadAction
    | ShowtimeLoadSuccessAction
    | ShowtimeLoadFailAction;