
import * as ui from './../actions/ui';

export interface State {
    rootTabIndex: number;

    moviesCategory: "current" | "future",
}

export const initialState: State = {
    rootTabIndex: 0,

    moviesCategory: "current",
};

export function reducer(state: State = initialState, actionRaw: ui.Actions): State {
    switch (actionRaw.type) {
        case ui.ActionTypes.ROOT_CHANGE_TAB: {
            let action = <ui.RootChangeTabAction>actionRaw;
            let newIndex = action.payload;

            return Object.assign({}, state, {
                rootTabIndex: newIndex,
            });
        }
        case ui.ActionTypes.CHANGE_MOVIES_CATEGORY: {
            let action = <ui.ChangeMoviesCategoryAction>actionRaw;

            return Object.assign({}, state, {
                moviesCategory: action.payload
            });
        }

        default: {
            return state;
        }
    }
}

export const getRootTabIndex = (state: State) => state.rootTabIndex;
export const getMoviesCategory = (state: State) => state.moviesCategory;