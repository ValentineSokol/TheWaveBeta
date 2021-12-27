import {createSlice} from "@reduxjs/toolkit";
import * as WsSelectors from './selectors';

const WebSocketSlice = createSlice( {
    name: 'WebSocketSlice',
    initialState: { isWsOpen: false, message: null  },
    reducers: {
        statusChange: (state, action) => {
            state.isWsOpen = action.payload;
        },
        reconnect: (state, action) => {
            state.isWsReconnecting = action.payload;
        },
        messageReceived: (state, { payload: message }) => {
            state.message = message;
        },
        messageSent: (state, action) => {
            state.lastSentMessage = action.payload;
        }
    },
});

export const WebSocketReducer = WebSocketSlice.reducer;
export const actions = WebSocketSlice.actions;
export const sendWsMessage = actions.messageSent;
export const selectors = WsSelectors;
