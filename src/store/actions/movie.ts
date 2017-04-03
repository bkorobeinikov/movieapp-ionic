import { Action } from '@ngrx/store';
import { type } from './../util';

import { Movie } from './../models';

export const ActionTypes = {
    LOAD_CHECK_CACHE: type("[Movie] Load Check Cache"),
    LOAD: type("[Movie] Load"),
    LOAD_SUCCESS: type("[Movie] Load Success"),
    LOAD_FAIL: type("[Movie] Load Fail"),

    SELECT: type("[Movie] Select"),
};

export class LoadCheckCacheAction implements Action {
    readonly type = ActionTypes.LOAD_CHECK_CACHE;

    constructor(public payload: { cinemaId: string }) { }
}

export class LoadAction implements Action {
    readonly type = ActionTypes.LOAD;

    constructor(public payload: { cinemaId: string }) { }
}

export class LoadSuccessAction implements Action {
    readonly type = ActionTypes.LOAD_SUCCESS;

    constructor(public payload: {
        cinemaId: string,
        released: Movie[],
        other: Movie[],
    }) { }
}

export class LoadFailAction implements Action {
    readonly type = ActionTypes.LOAD_FAIL;

    constructor(public payload: { cinemaId: string, errorMessage: string }) { }
}

export class SelectAction implements Action {
    readonly type = ActionTypes.SELECT;

    /**
     * 
     * @param payload movie id
     */
    constructor(public payload: string) { }
}

export type Actions
    = LoadCheckCacheAction
    | LoadAction
    | LoadSuccessAction
    | LoadFailAction
    | SelectAction;