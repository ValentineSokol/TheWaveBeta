import {createSlice} from "@reduxjs/toolkit";


const WebSocketSlice = createSlice( {
    name: 'WebSocketSlice',
    initialState: { isWsOpen: false, messages: {}  },
    reducers: {
        statusChange: (state, action) => {
            state.isWsOpen = action.payload;
        },
        reconnect: (state, action) => {
            state.isWsReconnecting = action.payload;
        },
        message: (state, { payload: message }) => {
            state.messages[message.type] = message.payload;
        }
    },
});

export const WebSocketReducer = WebSocketSlice.reducer;
export const actions = WebSocketSlice.actions;
