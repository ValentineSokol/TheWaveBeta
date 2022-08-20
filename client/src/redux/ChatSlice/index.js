import { createSlice } from "@reduxjs/toolkit";
import {fetchUserChatrooms, fetchDirectChatroom, fetchMultiUserChatroom} from '../actions/api/chat';

const chatSlice = createSlice( {
    name: 'chatSlice',
    initialState: { chatrooms: [], selectedChatroom: null },
    reducers: {
        selectChatroom: (state, { payload }) => {
            state.selectedChatroomId = payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserChatrooms.fulfilled, (
            state,
            { payload}
        ) => {
            state.chatrooms = payload;
        });
        builder.addCase(fetchDirectChatroom.fulfilled, (
            state,
            { payload: { id, Users, Messages }}
        ) => {
            state.selectedChatroomId = id;
            state.selectedChatroomHistory = { users: Users, messages: Messages };
        });
        builder.addCase(fetchMultiUserChatroom.fulfilled, (
            state,
            { payload}
        ) => {
            state.selectedChatroomId = payload.id;
            state.selectedChatroomHistory = { users: payload.Users, messages: payload.Messages };
        });
    },
});

export const chatReducer = chatSlice.reducer;
export const actions = chatSlice.actions;