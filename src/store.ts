
import { createStore, combineReducers } from 'redux';

import dataReducer from './data/reducer';

export interface IStore {
    data: IData
}

const appReducer = combineReducers<IStore>({
    data: dataReducer
});

const store = createStore<IStore>(appReducer, {
    data: {
        user: null,
        movies: [
            {id: 0, name: 'name'}
        ]
    }
});

// store structure
// - store
//   - data
//     - user: {}
//     - movies: []
//   - services

export default store;
