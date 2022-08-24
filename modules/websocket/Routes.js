const { Router } = require('express');
const WebSocketManager = require('./WebsocketController');
const AuthProvider = require('../auth/AuthProvider');
const UserModel = require('../user/UserModel');

const router = Router();
router.ws('/connect', async (ws, req) => {
    const userId = AuthProvider.getUserFromSession(req);

    const user = await UserModel.getUser(userId);

    ws.on('message', json => {
        console.log({ json })
        const message = JSON.parse(json);
        if (message.type === 'watch-user-status') {
            const targetUserId = message.payload;
            WebSocketManager.watchUserOnlineStatus(user.id, targetUserId);
        }
        if (message.type === 'is-typing' || message.type === 'stopped-typing') {
            const { chatId, isDirect } = message.payload;
            if (isDirect) WebSocketManager.sendMessage(chatId, message);
        }
    })

    WebSocketManager.connect(user.id, ws);


    ws.on('close', async (ws) => {
        console.log('close')
        await WebSocketManager.disconnect(user.id, ws);
    });

});

module.exports = router;