import { Action } from '@ngrx/store';
import { type } from './../util';

import { Account, Ticket } from './../models';
import { AsyncStatus } from './../viewModels';

export const ActionTypes = {
    LOGIN: type("[Account] Login"),
    LOGIN_SUCCESS: type("[Account] Login Success"),
    LOGIN_FAIL: type("[Account] Login Fail"),
    LOGOUT: type("[Account] Logout"),
    LOGOUT_SUCCESS: type("[Account] Logout Success"),

    SIGNUP_STAGE1: type("[Account] SignUp Stage 1"),
    SIGNUP_STAGE1_SUCCESS: type("[Account] SignUp Stage 1 Success"),
    SIGNUP_STAGE1_FAIL: type("[Account] SignUp Stage 1 Fail"),
    SIGNUP_STAGE2: type("[Account] SignUp Stage 2"),
    SIGNUP_STAGE2_SUCCESS: type("[Account] SignUp Stage 2 Success"),
    SIGNUP_STAGE2_FAIL: type("[Account] SignUp Stage 2 Fail"),

    VERIFY_AUTH: type("[Account] Verify Auth"),
    VERIFY_AUTH_LOGIN_SUCCESS: type("[Account] Verify Auth Login Success"),
    VERIFY_AUTH_UPDATE_SUCCESS: type("[Account] Verify Auth Update Success"),
    VERIFY_AUTH_FINISH: type("[Account] Verify Auth Finish"),

    UPDATE: type("[Account] Update"),
    UPDATE_SUCCESS: type("[Account] Update Success"),
    UPDATE_FAIL: type("[Account] Update Fail"),

    CHANGE_NOTIFICATIONS: type("[Account] Change Notifications"),
};

export enum LoginMethod {
    None,
    Facebook,
    Email,
}

export class LoginAction implements Action {
    readonly type = ActionTypes.LOGIN;

    constructor(public payload: {
        loginMethod: LoginMethod,
        email?: string,
        password?: string,

        fake?: boolean,
    }) {
    }
}

export class LoginSuccessAction implements Action {
    readonly type = ActionTypes.LOGIN_SUCCESS;

    constructor(public payload: { authToken: string, fake?: boolean }) { }
}

export class LoginFailAction implements Action {
    readonly type = ActionTypes.LOGIN_FAIL;

    constructor(public payload: {
        errorMessage: string,
    }) { }
}

export class LogoutAction implements Action {
    readonly type = ActionTypes.LOGOUT;

    constructor() { }
}

export class LogoutSuccessAction implements Action {
    readonly type = ActionTypes.LOGOUT_SUCCESS;

    constructor() { }
}

export class SignUpStage1Action implements Action {
    readonly type = ActionTypes.SIGNUP_STAGE1;

    constructor(public payload: { phone: string }) { }
}

export class SignUpStage1SuccessAction implements Action {
    readonly type = ActionTypes.SIGNUP_STAGE1_SUCCESS;

    constructor() { }
}

export class SignUpStage1FailAction implements Action {
    readonly type = ActionTypes.SIGNUP_STAGE1_FAIL;

    constructor(public payload: { message: string }) { }
}

export class SignUpStage2Action implements Action {
    readonly type = ActionTypes.SIGNUP_STAGE2;

    constructor(public payload: { email: string, password: string, smsCode: string, phone: string }) { }
}

export class SignUpStage2SuccessAction implements Action {
    readonly type = ActionTypes.SIGNUP_STAGE2_SUCCESS;

    constructor() { }
}

export class SignUpStage2FailAction implements Action {
    readonly type = ActionTypes.SIGNUP_STAGE2_FAIL;

    constructor(public payload: { message: string }) { }
}

export class VerifyAuthAction implements Action {
    readonly type = ActionTypes.VERIFY_AUTH;

    constructor() { }
}

export class VerifyAuthLoginSuccessAction implements Action {
    readonly type = ActionTypes.VERIFY_AUTH_LOGIN_SUCCESS;

    constructor(public payload: LoginSuccessAction) { }
}

export class VerifyAuthUpdateSuccessAction implements Action {
    readonly type = ActionTypes.VERIFY_AUTH_UPDATE_SUCCESS;

    constructor(public payload: UpdateSuccessAction) { }
}

export class VerifyAuthFinishAction implements Action {
    readonly type = ActionTypes.VERIFY_AUTH_FINISH;

    constructor(public payload: { status: AsyncStatus, message?: string }) { }
}

export class UpdateAction implements Action {
    readonly type = ActionTypes.UPDATE;

    constructor() { }
}

export class UpdateSuccessAction implements Action {
    readonly type = ActionTypes.UPDATE_SUCCESS;

    constructor(public payload: { account: Account, tickets: Ticket[] }) { }
}

export class UpdateFailAction implements Action {
    readonly type = ActionTypes.UPDATE_FAIL;

    constructor(public payload: {
        requireLogin: boolean,
        errorMessage: string,
    }) { }
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
    | LogoutSuccessAction

    | SignUpStage1Action
    | SignUpStage1SuccessAction
    | SignUpStage1FailAction
    | SignUpStage2Action
    | SignUpStage2SuccessAction
    | SignUpStage2FailAction

    | UpdateAction
    | UpdateSuccessAction
    | UpdateFailAction
    | ChangeNotificationsAction

    | VerifyAuthAction
    | VerifyAuthLoginSuccessAction
    | VerifyAuthUpdateSuccessAction
    | VerifyAuthFinishAction;



