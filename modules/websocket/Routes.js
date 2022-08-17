const { Router } = require('express');
const WebSocketManager = require('./WebsocketController');
const AuthProvider = require('../auth/AuthProvider');
const UserModel = require('../user/UserModel');

const router = Router();
router.ws('/connect', async (ws, req) => {
    const userId = AuthProvider.getUserFromSession(req);
    if (!userId) {
        ws.terminate();
        return;
    }
    const user = await UserModel.getUser(userId);

    if (!user) {
        ws.terminate();
        console.info('Connection terminated!')
    }
    WebSocketManager.connect(user.id, ws);

    ws.on('message', async json => {
        const message = JSON.parse(json);
        if (message.type === 'watch-user-status') {
            const targetUserId = message.payload;
            WebSocketManager.watchUserOnlineStatus(user.id, targetUserId);
            // else {
            //     const userRecord = await Users.findByPk(targetUserId);
            //     ws.send(JSON.stringify({
            //         type: `user-status-${targetUserId}`,
            //         payload: {
            //             online: false,
            //             lastSeen: userRecord.lastSeen
            //         }
            //     }));
            // }
        }
        if (message.type === 'is-typing' || message.type === 'stopped-typing') {
            const { chatId, isDirect } = message.payload;
            if (isDirect) WebSocketManager.sendMessage(chatId, message);
        }
    })
    ws.on('close', async (ws) => {
        const lastSeen = Date.now();
        try {
            await user.update({lastSeen});
        }
        catch (err) {
            console.error(`Error when updating user's lastSeen: ${err}`);
        }
        WebSocketManager.disconnect(user.id, ws);
    });

});

module.exports = router;