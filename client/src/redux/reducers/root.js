import { combineReducers } from 'redux';
import { createReducer } from '@reduxjs/toolkit';
import { checkLogin, logout, loadProfile } from '../actions/async';
export default combineReducers({
    global: createReducer({}, {
        [checkLogin.fulfilled]: (state, action) => {
            state.user = action.payload;
        },
        [logout.fulfilled]: (state, action) => {
            state.user = {};
        }
    }),
    profile: createReducer({}, {
        [loadProfile.fulfilled]: (state, action) => {
            const { user } = action.payload; 
            state.user = user; 
        }
    })
});