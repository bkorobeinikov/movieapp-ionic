
import * as ui from './../actions/ui';

export interface State {
    rootTabIndex: number;
}

export const initialState: State = {
    rootTabIndex: 0,
};

export function reducer(state = initialState, actionRaw: ui.Actions): State {
    switch(actionRaw.type) {
        case ui.ActionTypes.ROOT_CHANGE_TAB: {
            var action = <ui.RootChangeTabAction>actionRaw;
            var newIndex = action.payload;

            return Object.assign({}, state, {
                rootTabSelectedIndex: newIndex,
            });
        }

        default: {
            return state;
        }
    }
}

export const getRootTabIndex = (state: State) => state.rootTabIndex;