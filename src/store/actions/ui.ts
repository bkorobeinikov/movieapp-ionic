import { Action } from '@ngrx/store';
import { type } from './../util';

export const ActionTypes = {
    ROOT_CHANGE_TAB: type("[Root] Change Tab"),
    CHANGE_MOVIES_CATEGORY: type("[Root] Change Movies Category"),
};

export class RootChangeTabAction implements Action {
    readonly type = ActionTypes.ROOT_CHANGE_TAB;

    constructor(public payload: number) { }
}

export class ChangeMoviesCategoryAction implements Action {
    readonly type = ActionTypes.CHANGE_MOVIES_CATEGORY;

    /**
     * 
     * @param payload movies category
     */
    constructor(public payload: "current" | "future") {}
}

export type Actions
    = RootChangeTabAction
    | ChangeMoviesCategoryAction;