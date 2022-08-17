import { createSlice } from "@reduxjs/toolkit";
import { fetchUserChatrooms } from '../actions/api/chat';

const chatSlice = createSlice( {
    name: 'chatSlice',
    initialState: { chatrooms: null },
    extraReducers: (builder) => {
        builder.addCase(fetchUserChatrooms.fulfilled, (
            state,
            { payload}
        ) => {
            state.chatrooms = payload;
        })
    },
});

export const chatReducer = chatSlice.reducer;
export const actions = chatSlice.actions;