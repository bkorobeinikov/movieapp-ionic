import { Action } from '@ngrx/store';
import { type } from './../util';

import { Ticket } from "./../models";

export const ActionTypes = {
    LOAD: type("[Ticket] Load"),
    LOAD_SUCCESS: type("[Ticket] Load Success"),
    LOAD_FAIL: type("[Ticket] Load Fail"),

    SELECT: type("[Ticket] Select"),
}

export class LoadAction implements Action {
    readonly type = ActionTypes.LOAD;

    constructor() { }
}

export class LoadSuccessAction implements Action {
    readonly type = ActionTypes.LOAD_SUCCESS;

    constructor(public payload: Ticket[]) { }
}

export class LoadFailAction implements Action {
    readonly type = ActionTypes.LOAD_FAIL;

    constructor(public payload: { errorMessage: string }) { }
}

export class SelectAction implements Action {
    readonly type = ActionTypes.SELECT;

    /**
     * 
     * @param payload ticket id
     */
    constructor(public payload: string) { }
}

export type Actions
    = LoadAction
    | LoadSuccessAction
    | LoadFailAction
    | SelectAction;