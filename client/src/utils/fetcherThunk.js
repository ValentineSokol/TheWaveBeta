import { createAsyncThunk } from '@reduxjs/toolkit';
import fetcher from './fetcher';

export default async (actionType, url, method, payload, dispatch) => createAsyncThunk(
    actionType,
    async function thunk() {
        const fetcherOptions = {};
        if (method) fetcherOptions.method =  method;
        if (payload) {
            fetcherOptions.body = JSON.stringify(payload);
            fetcherOptions.headers = { 'Content-Type': 'application/json' }
        } 
        const res = await fetcher(url, fetcherOptions);
        return res;
    }
)