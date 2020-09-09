import { combineReducers } from 'redux';
import { createReducer } from '@reduxjs/toolkit';
import { checkLogin, logout, loadProfile, uploadFiles } from '../actions/async';
export default combineReducers({
    global: createReducer({}, {
        [checkLogin.fulfilled]: (state, action) => {
            state.user = action.payload;
        },
        [logout.fulfilled]: (state, action) => {
            state.user = {};
        },
        [loadProfile.fulfilled]: (state, action) => {
            const { user } = action.payload; 
            state.loadedProfile = user;
            state.ownsProfile = state.user && user && state.user.userId === user.id;   
        },
        [uploadFiles.fulfilled]: (state, action) => {
            state.uploadedFiles = action.payload.urls;
        },
        [uploadFiles.rejected]: (state, action) => {
            console.log(action);
        }
    }),
});