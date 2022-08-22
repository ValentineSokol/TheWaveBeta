import { createAsyncThunk } from '@reduxjs/toolkit';
import fetcher from '../../utils/fetcher';
import {createNotification} from "../../redux/NotificationSlice/index";

export const register = createAsyncThunk(
    'register',
    async (body, { dispatch}) => fetcher('/users', { method: 'POST', payload: body })
        .then(res => {
            if (!res.ok) {
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
    async (body, { dispatch}) => fetcher('/auth/local', { method: 'POST', payload: body })
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
    () => fetcher('/auth/authenticate', { method: 'POST' })
)
export const logout = createAsyncThunk(
    'logout',
    () => fetcher('/auth/logout', { method: 'DELETE' })
)
export const loadProfile = createAsyncThunk(
    'profile',
    (id) => fetcher(`/users/${id}`)
)
export const uploadFiles = createAsyncThunk(
    'uploadFiles',
    (...files) => fetcher('/files/upload', { method: 'POST', payload: { files }, isFormData: true })
)
export const updateUser = createAsyncThunk(
    'updateUser',
    (payload) => fetcher(`/users`, { method: 'PATCH', payload, isFormData: true })
)
export const sendPasswordRecoveryCode = createAsyncThunk(
    'sendPasswordRecoveryCode',
    (payload) => fetcher('/auth/password/recover', { method: 'PUT', payload })
)
export const changePassword = createAsyncThunk(
    'changePassword',
    (payload) => fetcher('/auth/password/update', { method: 'PATCH', payload })
)