import { Action } from '@ngrx/store';
import { type } from './../util';

export const ActionTypes = {
    ROOT_CHANGE_TAB: type("[Root] Change Tab"),
};

export class RootChangeTabAction implements Action {
    readonly type = ActionTypes.ROOT_CHANGE_TAB;

    constructor(public payload: number) { }
}

export type Actions
    = RootChangeTabAction;