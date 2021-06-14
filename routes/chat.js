const { Router } = require('express');
const { Users, directMessages } = require('../models');
const auth = require('../middlewares/auth');
const {Op} = require('sequelize');

module.exports = (server) => {
    const router = Router();
    router.put('/sendDirectMessage/:addressee', auth, async (req, res) => {
        const { addressee } = req.params;
        const { text } = req.body;
        try {
            await directMessages.create({
                from: req.user.id,
                to: addressee,
                text
            });
            res.sendStatus(200);
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
                   [Op.or]: [{ from: req.user.id, to: companion }, { from: companion, to: req.user.id }],
                   createdAt: {
                       [Op.gte]: messageTimeThreshold
                   }
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