const { Router } = require('express');
const { directMessages } = require('../models');
const auth = require('../middlewares/auth');
const getUserFromSession = require('../utils/getUserFromSession');
const {Op} = require('sequelize');


module.exports = (server) => {
    const router = Router();
    server.websocketConnections = {};
    router.ws('/user/connect', async (ws, req, res, next) => {
        const userPromise = getUserFromSession(req);
        if (!userPromise) {
            ws.terminate();
            return;
        }
        const user = await userPromise;

        if (!user) {
            ws.terminate();
            console.info('Connection terminated!')
            return;
        }
        const userConnection = server.websocketConnections[user.id];
        if (!userConnection) {
            server.websocketConnections[user.id] = {ws, isOnline: true, subscribers: []};
        }
        else {
            userConnection.ws = ws;
        }
        console.info(`User ${user.username} has connected!`);
        ws.on('message', json => {
            const message = JSON.parse(json);
            if (message.type === 'watch-user-status') {
                const userId = message.payload;
                server.websocketConnections[userId].subscribers.push(ws);
            }
            if (message.type === 'ping') {
               const addressee = server.websocketConnections[req.user.id];
               if (addressee.readyState !== 1) return;
               addressee.send(JSON.stringify({ type: 'pong' }));
            }
        })
        ws.on('close', (ws, req) => {
          const userConnection = server.websocketConnections[req.user.id];
          userConnection.offlineInterval = setInterval(() => {
               userConnection.ws = null;
               userConnection.lastSeen = Date.now;
               userConnection.isOnline = false;

               userConnection.subscribers.forEach(subscriber => {
                   const message = {
                       userConnection: req.userConnection.id,
                       lastSeen: user.lastSeen
                   };
                   if (subscriber.readyState !== 1) return;
                   subscriber.send(JSON.stringify(message));
               });
           }, 3000);
        });

    });
    router.put('/sendDirectMessage/:addressee', auth, async (req, res) => {
        const { addressee } = req.params;
        const { text } = req.body;
        try {
            await directMessages.create({
                from: req.user.id,
                to: addressee,
                text
            });
            const userConnection = server.websocketConnections[addressee];
            if (userConnection &&  userConnection.ws && userConnection.ws.readyState === 1) {
                const message = { type: 'message', from: req.user.id, text };
                userConnection.ws.send(JSON.stringify(message));
            }
            res.json({ success: true });
        }
        catch(err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to send message!'});
        }
    });
    router.get('/getDirectMessages/:companion', auth, async (req, res) => {
       const { companion } = req.params;
       const { datePeriod } = req.body;
       try {
           const lastViewedMessageDate = new Date(datePeriod);
           const messageTimeThreshold = lastViewedMessageDate.setDate(lastViewedMessageDate.getDate() - 3);
           const messages = await directMessages.findAll({
               where: {
                   [Op.or]: [{ from: req.user.id, to: companion }, { from: companion, to: req.user.id }]
               }
           });
           res.json(messages);
       }
       catch(err) {
           console.error(err);
           return res.status(500).json({ error: 'Failed to fetch message history.'});
       }

    });
    return router;
}