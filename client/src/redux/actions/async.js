import { createAsyncThunk } from '@reduxjs/toolkit';
import fetcher from '../../utils/fetcher';

export const submitRegister = createAsyncThunk(
    'registerFormSubmit',
    async (body) => fetcher('/auth/local', 'POST', body)
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