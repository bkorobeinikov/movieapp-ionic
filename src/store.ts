
import { createStore, combineReducers } from 'redux';

import dataReducer from './data/reducer';

export interface IStore {
    data: IData,
    services: any
}

const appReducer = combineReducers<IStore>({
    data: dataReducer
});

const store = createStore<IStore>(appReducer);

// store structure
// - store
//   - data
//     - user: {}
//     - movies: []
//   - services

export default store;
