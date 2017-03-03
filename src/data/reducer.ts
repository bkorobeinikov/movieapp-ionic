import { combineReducers } from 'redux';

import userReducer from './user/reducer';
import moviesReducer from './movies/reducer';

export default combineReducers<IData>({
    user: userReducer,
    movies: moviesReducer
});