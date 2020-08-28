import { combineReducers } from 'redux';
import { createReducer } from '@reduxjs/toolkit';
import { checkLogin, logout } from '../actions/async';
export default combineReducers({
    global: createReducer({}, {
        [checkLogin.fulfilled]: (state, action) => {
            state.user = action.payload;
        },
        [logout.fulfilled]: (state, action) => {
            state.user = {};
        }
 
    })
});