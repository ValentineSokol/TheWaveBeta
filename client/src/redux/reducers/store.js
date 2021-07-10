import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import root from './root';
import WebSocketBridge from '../WebSocketSlice/WebSocketBridge';
import getWebSocketUrl from '../../utils/WebSocket/getUrl';
import {checkLogin} from '../actions/api';

const webSocketBridge = WebSocketBridge({
        url: getWebSocketUrl(),
        openOnActionType: checkLogin.fulfilled
   });
   const store = configureStore({
        reducer: root,
        middleware: [ ...getDefaultMiddleware(), webSocketBridge]
    });

export default store;
