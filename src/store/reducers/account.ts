import * as actionsAccount from './../actions/account';
import * as actionsCinema from './../actions/cinema';

import { Account, AsyncStatus } from './../models';

export interface State {
    account: Account;

    auth: {
        method: actionsAccount.LoginMethod;

        email: string;
        password: string;

        token: string;
    };

    verifyAuth: {
        status: AsyncStatus;
        completedAt: Date;
    };

    loggedIn: boolean;
    loggingIn: boolean;

    updating: boolean;
    updatedAt: Date;
}

export const initialState: State = {
    account: null,

    auth: {
        method: actionsAccount.LoginMethod.None,
        email: null,
        password: null,
        token: null,
    },

    verifyAuth: {
        status: AsyncStatus.None,
        completedAt: null,
    },

    loggedIn: false,
    loggingIn: false,

    updating: false,
    updatedAt: null,
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
                loggingIn: true,
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
                loggingIn: false,
                loggedIn: true,
                updating: false,
            });
        }
        case actionsAccount.ActionTypes.LOGIN_FAIL: {
            return Object.assign({}, state, {
                account: null,
                auth: {},
                loggingIn: false,
                loggedIn: false,
                updating: false,
                updatedAt: null,
            });
        }
        case actionsAccount.ActionTypes.LOGOUT: {
            return Object.assign({}, state, {
                account: null,
                auth: {},
                verifyAuth: {
                    status: AsyncStatus.None,
                    completedAt: null
                },
                loggingIn: false,
                loggedIn: false,
                updating: false,
                updatedAt: null,
            });
        }
        case actionsAccount.ActionTypes.UPDATE: {
            return Object.assign({}, state, {
                updating: true,
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
                updating: false,
                updatedAt: new Date,
            });
        }
        case actionsAccount.ActionTypes.UPDATE_FAIL: {

            return Object.assign({}, state, {
                account: null,
                loggedIn: false,
                updating: false,
                updatedAt: null,
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
        case actionsCinema.ActionTypes.CHANGE_CURRENT: {
            let action = <actionsCinema.ChangeCurrentAction>actionRaw;

            return Object.assign({}, state, {
                account: Object.assign({}, state.account, {
                    cinemaId: action.payload,
                }),
            });
        }
        case actionsAccount.ActionTypes.VERIFY_AUTH: {
            return Object.assign({}, state, {
                verifyAuth: {
                    status: AsyncStatus.InProgress,
                    completedAt: null,
                },
            });
        }
        case actionsAccount.ActionTypes.VERIFY_AUTH_FINISH: {
            let action = <actionsAccount.VerifyAuthFinishAction>actionRaw;
            let status = action.payload.status;

            return Object.assign({}, state, {
                verifyAuth: {
                    status: status,
                    completedAt: new Date()
                },
            });
        }
        default: {
            return state;
        }
    }
}

export const getAccount = (state: State) => state.account;
export const getLoggingIn = (state: State) => state.loggingIn;
export const getLoggedIn = (state: State) => state.loggedIn;
export const getUpdating = (state: State) => state.updating;
export const getUpdatedAt = (state: State) => state.updatedAt;
export const getAuth = (state: State) => state.auth;
export const getVerifyAuth = (state: State) => state.verifyAuth;