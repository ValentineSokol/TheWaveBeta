import { createAsyncThunk } from '@reduxjs/toolkit';
import fetcher from '../../utils/fetcher';
import {createNotification} from "../../redux/NotificationSlice/index";

export const register = createAsyncThunk(
    'register',
    async (body, { dispatch}) => fetcher('/auth/register', 'POST', body)
        .then(res => {
            if (!res.success) {
                return;
            }
            dispatch(createNotification('Welcome!', 'success'));
            dispatch(checkLogin());
        })
        .catch(err => dispatch(
            createNotification(`Failed to register.`, 'error')
        ))
);
export const login = createAsyncThunk(
    'login',
    async (body, { dispatch}) => fetcher('/auth/local', 'POST', body)
        .then(res => {
            if (!res.success) {
             return;
            }
            dispatch(createNotification('Welcome!', 'success'));
            dispatch(checkLogin());
        })
        .catch(err => dispatch(
            createNotification(`Failed to register.`, 'error')
        ))
);
export const checkLogin = createAsyncThunk(
    'authenticate',
    () => fetcher('/users/authenticate')
)
export const logout = createAsyncThunk(
    'logout',
    () => fetcher('/auth/logout', 'DELETE')
)
export const loadProfile = createAsyncThunk(
    'profile',
    (id) => fetcher(`/users/${id}`)
)
export const uploadFiles = createAsyncThunk(
    'uploadFiles',
    (...files) => fetcher('/files/upload', 'POST', { files }, { isFormData: true } )
)
export const updateUser = createAsyncThunk(
    'updateUser',
    (payload) => fetcher(`/users`, 'PATCH', payload)
)
export const sendPasswordRecoveryCode = createAsyncThunk(
    'sendPasswordRecoveryCode',
    (payload) => fetcher('/auth/password/recover', 'PUT', payload)
)
export const changePassword = createAsyncThunk(
    'changePassword',
    (payload) => fetcher('/auth/password/update', 'PATCH', payload)
)