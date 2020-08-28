import { createAsyncThunk } from '@reduxjs/toolkit';
import fetcher from '../../utils/fetcher';
import fetcherThunk from '../../utils/fetcherThunk';

export const submitRegister = createAsyncThunk(
    'registerFormSubmit',
    async ({ username, password }) => {
        console.log(password);
        const res = await fetcher('/auth/local', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        return res;
    }
);
export const checkLogin = createAsyncThunk(
    'checkLogin',
    async () => {
        const res = await fetcher('/auth/isLoggedIn');
        return res;
    }
)
export const logout = createAsyncThunk(
    'logout',
    async () => {
        const res = await fetcher('/auth/logout', { method: 'DELETE' });
        return res;
    }
)