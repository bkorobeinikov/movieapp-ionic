import { Action } from '@ngrx/store';
import { type } from './../util';

import { Account } from './../models';

export const ActionTypes = {
    LOGIN: type("[Account] Login"),
    LOGIN_SUCCESS: type("[Account] Login Success"),
    LOGIN_FAIL: type("[Account] Login Fail"),
    LOGOUT: type("[Account] Logout"),

    UPDATE: type("[Account] Update"),
    UPDATE_SUCCESS: type("[Account] Update Success"),
    UPDATE_FAIL: type("[Account] Update Fail"),

    CHANGE_NOTIFICATIONS: type("[Account] Change Notifications"),
};

export enum LoginMethod {
    Facebook,
    Username,
}

export class LoginAction implements Action {
    readonly type = ActionTypes.LOGIN;

    constructor(public payload: {
        loginMethod: LoginMethod,
        username?: string,
        password?: string,
    }) {
    }
}

export class LoginSuccessAction implements Action {
    readonly type = ActionTypes.LOGIN_SUCCESS;

    constructor(public payload: Account) { }
}

export class LoginFailAction implements Action {
    readonly type = ActionTypes.LOGIN_FAIL;

    constructor(public payload: any) { }
}

export class LogoutAction implements Action {
    readonly type = ActionTypes.LOGOUT;

    constructor() { }
}

export class UpdateAction implements Action {
    readonly type = ActionTypes.UPDATE;

    constructor(public payload: any) { }
}

export class UpdateSuccessAction implements Action {
    readonly type = ActionTypes.UPDATE_SUCCESS;

    constructor(public payload: Account) { }
}

export class UpdateFailAction implements Action {
    readonly type = ActionTypes.UPDATE_FAIL;

    constructor(public payload: any) { }
}

export class ChangeNotificationsAction implements Action {
    readonly type = ActionTypes.CHANGE_NOTIFICATIONS;

    constructor(public payload: {
        tickets?: boolean,
        updates?: boolean,
    }) { }
}

export type Actions
    = LoginAction
    | LoginSuccessAction
    | LoginFailAction
    | LogoutAction
    | UpdateAction
    | UpdateSuccessAction
    | UpdateFailAction
    | ChangeNotificationsAction;



