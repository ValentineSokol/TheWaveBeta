import { combineReducers } from 'redux';
import { createReducer } from '@reduxjs/toolkit';
import { checkLogin, logout, loadProfile, uploadFiles, sendPasswordRecoveryCode, submitRegister  } from '../actions/api';
import { notificationReducer } from "../NotificationSlice";
import {preferencesReducer} from "../PreferencesSlice";

export default combineReducers({
    global: createReducer({
        loginChecked: false
    }, {
        [checkLogin.pending]: (state, action) => {
            state.loading = true;
        },
        [checkLogin.fulfilled]: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.loginChecked = true;
        },
        [checkLogin.rejected]: (state, action) => {
            state.loading = false;
        },
        [logout.fulfilled]: (state, action) => {
            state.user = {};
        },
        [loadProfile.fulfilled]: (state, action) => {
            const { user } = action.payload;
            state.loadedUser = user;
            state.loading = false;
        },
        [uploadFiles.pending]: (state, action) => {
            state.loading = true;
        },
        [uploadFiles.rejected]: (state, action) => {
            state.loading = false;
        },
        [uploadFiles.fulfilled]: (state, action) => {
            state.uploadedFiles = action.payload.urls;
            state.loading = false;
        },
        [uploadFiles.rejected]: (state, action) => {
            console.log(action);
        },
        [sendPasswordRecoveryCode.fulfilled]: (state, action) => {
            state.recoveryCodeSent = true;
        },
        [submitRegister.fulfilled]: (state, action) => {
        }
    }),
    notifications: notificationReducer,
    preferences: preferencesReducer,
});