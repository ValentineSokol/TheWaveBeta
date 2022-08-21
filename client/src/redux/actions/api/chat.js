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

export const fetchChatroomById = createAsyncThunk(
    'fetchMultiUserChatroom',
    (id) => fetcher(`/chat/${id}`)
);

export const fetchChatroomFromQuery = createAsyncThunk(
    'fetchChatroomFromQuery',
    ({ chatType, id }, { dispatch}) => {
        if (chatType === 'direct') return dispatch(fetchDirectChatroom(id));
        dispatch(fetchChatroomById(id));
    }
);

export const sendMessage = createAsyncThunk(
    'sendMessage',
    ({ chatroomId, text }) => fetcher(
        `/chat/${chatroomId}/message`,
        {
            method: 'PUT',
            payload: { text: text.trim() }
        }
        )
);


