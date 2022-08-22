import { combineReducers } from 'redux';
import { createReducer } from '@reduxjs/toolkit';
import {
    queryParamsChanged
} from '../actions/misc';
import {
    checkLogin,
    register,
    logout,
    loadProfile,
    uploadFiles,
    sendPasswordRecoveryCode,
    updateUser
} from '../actions/api';
import { notificationReducer } from "../NotificationSlice";
import {preferencesReducer} from "../PreferencesSlice";
import {WebSocketReducer} from "../WebSocketSlice";
import { chatReducer } from '../ChatSlice';
import { loadersReducer } from '../LoadersSlice';

export default combineReducers({
    global: createReducer({
        loginChecked: false,
        uploadedFiles: [],
        queryParams: {}
    }, {
        [queryParamsChanged]: (state, action) => {
          state.queryParams = action.payload;
        },
        [checkLogin.pending]: (state, action) => {
            state.loading = true;
        },
        [register.pending]: (state, action) => {
          state.loading = true;
        },
        [checkLogin.fulfilled]: (state, action) => {
            if (!action.payload.isLoggedIn) return state;
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
        [updateUser.fulfilled]: (state) => {
            state.userUpdated = true;
        }
    }),
    notifications: notificationReducer,
    preferences: preferencesReducer,
    loaders: loadersReducer,
    WebSocket: WebSocketReducer,
    chat: chatReducer,
});