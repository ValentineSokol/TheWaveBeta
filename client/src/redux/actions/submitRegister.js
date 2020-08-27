import { createAsyncThunk } from '@reduxjs/toolkit';
import fetcher from '../../utils/fetcher';

export default createAsyncThunk(
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
)