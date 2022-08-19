import { createAsyncThunk } from '@reduxjs/toolkit';
import fetcher from '../../../utils/fetcher';

export const fetchUserChatrooms = createAsyncThunk(
    'fetchChatrooms',
    () => fetcher('/chat/chatrooms')
);

export const fetchDirectChatroom = createAsyncThunk(
    'fetchDirectChatroom',
    (companionId) => fetcher(`/chat/direct/${companionId}`, { method: 'PUT' })
);

export const fetchMultiUserChatroom = createAsyncThunk(
    'fetchMultiUserChatroom',
    (id) => fetcher(`/chat/${id}`)
);

export const fetchChatroomFromQuery = createAsyncThunk(
    'fetchChatroomFromQuery',
    ({ chatType, id }, { dispatch}) => {
        if (chatType === 'direct') return dispatch(fetchDirectChatroom(id));
        dispatch(fetchMultiUserChatroom(id));
    }

)


