import { createAsyncThunk } from '@reduxjs/toolkit';
import fetcher from '../../../utils/fetcher';

export const fetchUserChatrooms = createAsyncThunk(
    'fetchChatrooms',
    () => fetcher('/chat/chatrooms')
);
