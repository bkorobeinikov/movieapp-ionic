import * as actionsAccount from './../actions/account';
import * as actionsCinema from './../actions/cinema';

import { Account } from './../models';

export interface State {
    account: Account;

    loggedIn: boolean;
    loggingIn: boolean;

    updating: boolean;
}

export const initialState: State = {
    account: null,

    loggedIn: false,
    loggingIn: false,
    
    updating: false,
};

export function reducer(state: State, actionRaw: actionsAccount.Actions | actionsCinema.ChangeCurrentAction) {
    switch (actionRaw.type) {
        case actionsAccount.ActionTypes.LOGIN: {
            return Object.assign({}, state, {
                loggingIn: true,
            });
        }
        case actionsAccount.ActionTypes.LOGIN_SUCCESS: {
            let action = <actionsAccount.LoginSuccessAction>actionRaw;
            let account = action.payload;

            return Object.assign({}, state, {
                account: account,
                loggingIn: false,
                loggedIn: true,
                updating: false,
            });
        }
        case actionsAccount.ActionTypes.LOGIN_FAIL: {
            return Object.assign({}, state, {
                loggingIn: false,
            });
        }
        case actionsAccount.ActionTypes.LOGOUT: {
            return Object.assign({}, state, {
                account: null,
                logggingIn: false,
                loggedIn: false,
                updating: false,
            });
        }
        case actionsAccount.ActionTypes.UPDATE: {
            return Object.assign({}, state, {
                updating: true
            });
        }
        case actionsAccount.ActionTypes.UPDATE_SUCCESS: {
            let action = <actionsAccount.UpdateSuccessAction>actionRaw;
            let account = action.payload;

            return Object.assign({}, state, {
                account: account,
                updating: false,
            });
        }
        case actionsAccount.ActionTypes.UPDATE_FAIL: {

            return Object.assign({}, state, {
                account: null,
                updating: false,
            })
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
        default: {
            return state;
        }
    }
}

export const getAccount = (state: State) => state.account;
export const getLoggingIn = (state: State) => state.loggingIn;
export const getLoggedIn = (state: State) => state.loggedIn;
export const getUpdating = (state: State) => state.updating;