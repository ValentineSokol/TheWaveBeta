const { Router } = require('express');
const { Users, directMessages } = require('../models');
const auth = require('../middlewares/auth');
const getUserFromSession = require('../utils/getUserFromSession');
const {Op} = require('sequelize');


module.exports = (server) => {
    const router = Router();
    server.websocketConnections = {};
    server.userStatusSubscriptions = new Map();

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
            server.websocketConnections[user.id] = ws;
        }
        else {
            userConnection.ws = ws;
        }
        console.info(`User ${user.username} has connected!`);
        const statusSubscribers = server.userStatusSubscriptions.get(user.id);
        if (statusSubscribers) {
            statusSubscribers.forEach(subscriber => {
               if (subscriber.readyState !== 1) {
                   statusSubscribers.delete(subscriber);
                   return;
               }
               const message = { type: `user-status-${user.id}`, payload:  { online: true } };
               subscriber.send(JSON.stringify(message));
            });
        }
        ws.on('message', async json => {
            const message = JSON.parse(json);
            if (message.type === 'watch-user-status') {
                const targetUserId = message.payload;
                const allSubscriptionsForUser = server.userStatusSubscriptions.get(targetUserId);
                if (allSubscriptionsForUser) {
                    allSubscriptionsForUser.add(ws);
                }
                else  {
                    server.userStatusSubscriptions.set(targetUserId, new Set([ ws ]));
                }
                if (server.websocketConnections[targetUserId]) {
                    ws.send(JSON.stringify({type: `user-status-${user.id}`, payload: {online: true}}));
                }
                else {
                    const userRecord = await Users.findByPk(targetUserId);
                    ws.send(JSON.stringify({
                        type: `user-status-${targetUserId}`,
                        payload: {
                            online: false,
                            lastSeen: userRecord.lastSeen
                        }
                    }));
                }
            }
            if (message.type === 'ping') {
               const addressee = server.websocketConnections[user.id];
               if (addressee.readyState !== 1) return;
               addressee.send(JSON.stringify({ type: 'pong' }));
            }
            if (message.type === 'is-typing' || message.type === 'stopped-typing') {
                const { chatId, isDirect } = message.payload;
                if (isDirect) {
                    const addressee = server.websocketConnections[chatId];
                    if (addressee.readyState !== 1) return;
                    addressee.send(JSON.stringify(message));
                }
            }
        })
        ws.on('close', async (ws, req) => {
              server.websocketConnections[user.id] = null;
              const lastSeen = Date.now();
              try {
                  await user.update({lastSeen});
              }
              catch (err) {
                  console.error(`Error when updating user's lastSeen: ${err}`);
              }
              const allSubscriptionsForUser = server.userStatusSubscriptions.get(user.id);
              if (!allSubscriptionsForUser) return;
              allSubscriptionsForUser.forEach(subscriber => {
                   const message = {
                       type: `user-status-${user.id}`,
                       payload: {
                           online: false,
                           lastSeen
                       }
                   };
                   if (subscriber.readyState !== 1) {
                       allSubscriptionsForUser.delete(subscriber);
                       return;
                   }
                   subscriber.send(JSON.stringify(message));
               });
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
            if (userConnection && userConnection.readyState === 1) {
                const message = { type: 'message', payload: { from: req.user.id, text } };
                userConnection.send(JSON.stringify(message));
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