import { Action } from '@ngrx/store';
import { type } from './../util';

import { Movie } from './../models';

export const ActionTypes = {
    LOAD: type("[Movie] Load"),
    LOAD_SUCCESS: type("[Movie] Load Success"),
    LOAD_FAIL: type("[Movie] Load Fail"),
};

export class LoadAction implements Action {
    readonly type = ActionTypes.LOAD;

    constructor() { }
}

export class LoadSuccessAction implements Action {
    readonly type = ActionTypes.LOAD_SUCCESS;

    constructor(public payload: Movie[]) { }
}

export class LoadFailAction implements Action {
    readonly type = ActionTypes.LOAD_FAIL;

    constructor(public payload: any) { }
}

export type Actions
    = LoadAction
    | LoadSuccessAction
    | LoadFailAction;