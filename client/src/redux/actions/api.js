import { createAsyncThunk } from '@reduxjs/toolkit';
import fetcher from '../../utils/fetcher';
import {createNotification} from "../NotificationSlice";

export const submitRegister = createAsyncThunk(
    'registerFormSubmit',
    async (body, { dispatch}) => fetcher('/auth/local', 'POST', body)
        .then(res => {
            if (!res.success) {
             return;
            }
            dispatch(createNotification('Success!', 'success'));
        })
        .catch(err => dispatch(
            createNotification(`Failed to register.`, 'error')
        ))
);
export const checkLogin = createAsyncThunk(
    'checkLogin',
    () => fetcher('/auth/isLoggedIn')
)
export const logout = createAsyncThunk(
    'logout',
    () => fetcher('/auth/logout', 'DELETE')
)
export const loadProfile = createAsyncThunk(
    'profile',
    (id) => fetcher(`/user/profile/${id}`)
)
export const uploadFiles = createAsyncThunk(
    'uploadFiles',
    (body) => fetcher('/user/files/upload', 'PUT', body, { isFormData: true } )
)
export const updateUser = createAsyncThunk(
    'updateUser',
    (payload) => fetcher('/user/update', 'PATCH', payload)
)
export const sendPasswordRecoveryCode = createAsyncThunk(
    'sendPasswordRecoveryCode',
    (payload) => fetcher('/auth/password/recover', 'PUT', payload)
)
export const changePassword = createAsyncThunk(
    'changePassword',
    (payload) => fetcher('/auth/password/update', 'PATCH', payload)
)