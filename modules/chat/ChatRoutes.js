const { Router } = require('express');

const auth = require('../../middlewares/auth');

const {
    directChat,
    getChatroom,
    getUserChatrooms,
    sendMessage,
} = require('./ChatController');

const router = Router();

router.use(auth());

router.get('/chatrooms', getUserChatrooms);
router.put('/direct/:companion', directChat);
router.put('/:id/message', sendMessage);
router.get('/:id', getChatroom);

module.exports = router;