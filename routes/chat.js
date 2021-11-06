const { Router } = require('express');
const { Users, Chatrooms, Messages  } = require('../models');
const auth = require('../middlewares/auth');
const getUserFromSession = require('../utils/getUserFromSession');
const { sequelize } = require('../models/index');


module.exports = (server) => {
    const router = Router();
    server.websocketConnections = {};
    server.userStatusSubscriptions = {};

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
        const statusSubscribers = server.userStatusSubscriptions[user.id];
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
                const allSubscriptionsForUser = server.userStatusSubscriptions[targetUserId];
                if (allSubscriptionsForUser) {
                    allSubscriptionsForUser.add(ws);
                } else  {
                    server.userStatusSubscriptions[targetUserId] = new Set([ ws ]);
                }
                if (server.websocketConnections[targetUserId]) {
                    ws.send(JSON.stringify({type: `user-status-${targetUserId}`, payload: {online: true}}));
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
            if (message.type === 'is-typing' || message.type === 'stopped-typing') {
                const { chatId, isDirect } = message.payload;
                if (isDirect) {
                    const addressee = server.websocketConnections[chatId];
                    if (addressee?.readyState !== 1) return;
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
              const allSubscriptionsForUser = server.userStatusSubscriptions[user.id];
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
    router.get('/chatrooms', auth(), async (req, res) => {
      const user = await Users.findByPk(
          req.user.id,
          {
              include: [{
                  model: Chatrooms,
                  order: [Messages, 'createdAt', 'ASC'],
                  include: [
                      {
                          model: Users
                      },
                      {
                          model: Messages,
                          required: false,
                          limit: 1,
                          separate: true,
                          order: [ ['createdAt', 'DESC'] ]
                      }
                  ]
              }
              ]
          });
      res.json(user?.Chatrooms);
    });
    router.put('/findDirectChatroom/:companion', auth(), async (req, res) => {
        const transaction = await sequelize.transaction();
        const { companion } = req.params;
        const companionInfo = await Users.findByPk(Number(companion));
        if (companionInfo.isFrozen) {
            res.sendStatus(404);
            return;
        }
        const getHash = () => {
            const ids = [req.user.id, Number(companion)];
            if (ids.some(id => Number.isNaN(id))) {
                return res.status(400).json({ success: false, message: 'Invalid companion id.' });
            }
            ids.sort((a, b) => b - a);
            return ids.join('#');
        };
        const chatroomPayload = { directChatroomHash: getHash() };
        try {
            const [chatroom] = await Chatrooms.findOrCreate({
                where: chatroomPayload,
                defaults: {
                    ...chatroomPayload,
                },
                transaction
            });
            await chatroom.addUsers(req.user.id, {transaction});
            if (req.user.id !== Number(companion)) {
                await chatroom.addUsers(Number(companion),{transaction});
            }
            await transaction.commit();
            res.json(chatroom.id);
        }
        catch (err) {
            await transaction.rollback();
            console.error(err);
        }
    });
    router.put('/sendMessage/:chatroomId', auth(), async (req, res) => {
        const { chatroomId } = req.params;
        const { text } = req.body;
        const chatroom = await Chatrooms.findByPk(
            chatroomId,
            {
                include: [{
                    model: Users,
                    required: false
                }]
            }
        );
        const isMember = chatroom.Users.find(u => u.id === req.user.id);
        if (!chatroom || !isMember) return res.sendStatus(404);
        await Messages.create({
            chatroom: chatroomId,
            from: req.user.id,
            text: req.body.text
        });
        chatroom.Users.forEach(user => {
           if (user.id === req.user.id) return;
           const wsConnection = server.websocketConnections[user.id];
           if (wsConnection?.readyState !== 1) return;
            const message = { type: 'message', payload: { chatId: chatroom.id, from: req.user.id, username: req.user.username, text } };
            wsConnection.send(JSON.stringify(message));
        });
        res.json({ success: true });
    });
    router.get('/getChatroom/:id', auth(), async (req, res) => {
       const { id } = req.params;
       try {
           const chatroom = await Chatrooms.findByPk(
               id,
               {
                   include: [
                       {model: Users},
                       {model: Messages}
                   ]
               }
               );
           const isMember = chatroom.Users.find(u => u.id === req.user.id);
           if (!isMember) return res.sendStatus(404);
           res.json(chatroom);
       }
       catch(err) {
           console.error(err);
           return res.status(500).json({ error: 'Failed to fetch message history.'});
       }

    });

    return router;
}