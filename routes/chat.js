const { Router } = require('express');
const { directMessages } = require('../models');
const auth = require('../middlewares/auth');
const {Op} = require('sequelize');


module.exports = (server) => {
    const router = Router();
    server.websocketConnections = {};
    router.ws('/chat/user/connect', auth, (ws, req) => {
        server.websocketConnections[req.user.id] = { ws, isOnline: true, subscribers: [] };
        ws.on('message', json => {
            const message = JSON.parse(json);

            if (message.type === 'watch-user') {
                const userId = message.payload;
                server.websocketConnections[userId].subscribers.push(ws);
            }

        })
        ws.on('close', (ws, req) => {
           setInterval(() => {
               const user = server.websocketConnections[req.user.id];
               user.ws = null;
               user.lastSeen = Date.now;
               user.isOnline = false;

               user.subscribers.forEach(subscriber => {
                   const message = {
                       user: req.user.id,
                       lastSeen: user.lastSeen
                   };
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