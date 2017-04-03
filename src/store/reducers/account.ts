import * as actionsAccount from './../actions/account';
import * as actionsCinema from './../actions/cinema';

import { Account } from './../models';
import { AsyncOperation, AsyncStatus, makeAsyncOp, defaultAsyncOp } from "./../viewModels";

export interface State {
    account: Account;

    auth: {
        method: actionsAccount.LoginMethod;

        email: string;
        password: string;

        token: string;
    };

    loginOp: AsyncOperation;
    verifyOp: AsyncOperation;
    updateOp: AsyncOperation;

    signupStage1Op: AsyncOperation;
    signupStage2Op: AsyncOperation;
}

export const initialState: State = {
    account: null,

    auth: {
        method: actionsAccount.LoginMethod.None,
        email: null,
        password: null,
        token: null,
    },

    loginOp: defaultAsyncOp(),
    verifyOp: defaultAsyncOp(),
    updateOp: defaultAsyncOp(),

    signupStage1Op: defaultAsyncOp(),
    signupStage2Op: defaultAsyncOp(),
};

export function reducer(state: State = initialState, actionRaw: actionsAccount.Actions | actionsCinema.ChangeCurrentAction) {
    switch (actionRaw.type) {
        case actionsAccount.ActionTypes.LOGIN: {
            let action = <actionsAccount.LoginAction>actionRaw;
            let method = action.payload.loginMethod;
            let email = action.payload.email;
            let password = action.payload.password;

            return Object.assign({}, state, {
                auth: {
                    method: method,
                    email: email,
                    password: password,
                },
                loginOp: makeAsyncOp(AsyncStatus.Pending),
            });
        }
        case actionsAccount.ActionTypes.VERIFY_AUTH_LOGIN_SUCCESS:
        case actionsAccount.ActionTypes.LOGIN_SUCCESS: {
            if (actionRaw.type == actionsAccount.ActionTypes.VERIFY_AUTH_LOGIN_SUCCESS)
                actionRaw = (<actionsAccount.VerifyAuthLoginSuccessAction>actionRaw).payload;

            let action = <actionsAccount.LoginSuccessAction>actionRaw;
            let authToken = action.payload.authToken;

            return Object.assign({}, state, {
                auth: Object.assign({}, state.auth, {
                    token: authToken
                }),
                loginOp: makeAsyncOp(AsyncStatus.Success),
            });
        }
        case actionsAccount.ActionTypes.LOGIN_FAIL: {
            let action = <actionsAccount.LoginFailAction>actionRaw;

            return Object.assign({}, state, {
                account: null,
                auth: {},
                loginOp: makeAsyncOp(AsyncStatus.Fail, action.payload.errorMessage),
            });
        }
        case actionsAccount.ActionTypes.LOGOUT_SUCCESS: {
            return Object.assign({}, state, {
                account: null,
                auth: {},
                loginOp: defaultAsyncOp(),
                verifyOp: defaultAsyncOp(),
                updateOp: defaultAsyncOp(),
            });
        }
        case actionsAccount.ActionTypes.UPDATE: {
            return Object.assign({}, state, {
                updateOp: makeAsyncOp(AsyncStatus.Pending),
            });
        }
        case actionsAccount.ActionTypes.VERIFY_AUTH_UPDATE_SUCCESS:
        case actionsAccount.ActionTypes.UPDATE_SUCCESS: {
            if (actionRaw.type == actionsAccount.ActionTypes.VERIFY_AUTH_UPDATE_SUCCESS)
                actionRaw = (<actionsAccount.VerifyAuthUpdateSuccessAction>actionRaw).payload;

            let action = <actionsAccount.UpdateSuccessAction>actionRaw;
            let account = action.payload.account;

            return Object.assign({}, state, {
                account: Object.assign({}, account),
                updateOp: makeAsyncOp(AsyncStatus.Success),
            });
        }
        case actionsAccount.ActionTypes.UPDATE_FAIL: {
            let action = <actionsAccount.UpdateFailAction>actionRaw;

            return Object.assign({}, state, {
                updateOp: makeAsyncOp(AsyncStatus.Fail, action.payload.errorMessage),
            });
        }
        case actionsAccount.ActionTypes.CHANGE_NOTIFICATIONS: {
            let action = <actionsAccount.ChangeNotificationsAction>actionRaw;

            return Object.assign({}, state, {
                account: Object.assign({}, state.account, {
                    notifications: Object.assign({}, state.account.notifications, action.payload)
                }),
            });
        }
        case actionsAccount.ActionTypes.VERIFY_AUTH: {
            return Object.assign({}, state, {
                verifyOp: makeAsyncOp(AsyncStatus.Pending),
            });
        }
        case actionsAccount.ActionTypes.VERIFY_AUTH_FINISH: {
            let action = <actionsAccount.VerifyAuthFinishAction>actionRaw;

            return Object.assign({}, state, {
                verifyOp: makeAsyncOp(action.payload.status, action.payload.message),
            });
        }
        case actionsAccount.ActionTypes.SIGNUP_STAGE1: {
            return Object.assign({}, state, {
                signupStage1Op: makeAsyncOp(AsyncStatus.Pending),
            });
        }
        case actionsAccount.ActionTypes.SIGNUP_STAGE1_SUCCESS: {
            return Object.assign({}, state, {
                signupStage1Op: makeAsyncOp(AsyncStatus.Success),
            });
        }
        case actionsAccount.ActionTypes.SIGNUP_STAGE1_FAIL: {
            let action = <actionsAccount.SignUpStage1FailAction>actionRaw;
            return Object.assign({}, state, {
                signupStage1Op: makeAsyncOp(AsyncStatus.Fail, action.payload.message)
            })
        }
        case actionsAccount.ActionTypes.SIGNUP_STAGE2: {
            return Object.assign({}, state, {
                signupStage2Op: makeAsyncOp(AsyncStatus.Pending),
            });
        }
        case actionsAccount.ActionTypes.SIGNUP_STAGE2_FAIL: {
            let action = <actionsAccount.SignUpStage2FailAction>actionRaw;
            return Object.assign({}, state, {
                signupStage2Op: makeAsyncOp(AsyncStatus.Fail, action.payload.message)
            })
        }
        case actionsAccount.ActionTypes.SIGNUP_STAGE2_SUCCESS: {
            return Object.assign({}, state, {
                signupStage2Op: makeAsyncOp(AsyncStatus.Success),
            });
        }
        default: {
            return state;
        }
    }
}

export const getAccount = (state: State) => state.account;
export const getAuth = (state: State) => state.auth;
export const getLoginOp = (state: State) => state.loginOp;
export const getUpdateOp = (state: State) => state.updateOp;
export const getVerifyOp = (state: State) => state.verifyOp;

export const getSignupStage1Op = (state: State) => state.signupStage1Op;
export const getSignupStage2Op = (state: State) => state.signupStage2Op;
