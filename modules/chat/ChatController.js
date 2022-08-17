const ChatModel = require('./ChatModel');
const WebsocketManager = require('../websocket/WebsocketController');

const isMember = (userId, chatroom) => chatroom.Users.find(u => u.id === userId);

const directChat = async (req, res) => {
    const chatroom = await ChatModel.findOrCreateDirectChatroom(req.user.id, Number(req.params.companion));
    res.json(chatroom.id);
};

const getChatroom = async (req, res) => {
    const chatroom = await ChatModel.getChatroom(req.params.id);
    if (!chatroom || !isMember(req.user.id, chatroom)) return res.sendStatus(404);
    res.json(chatroom);
};

const getUserChatrooms = async (req, res) => {
    const chatrooms = await ChatModel.getUserChatrooms(req.user);
    res.json(chatrooms);
};

const sendMessage = async (req, res) => {
    const { text } = req.body;
    const chatroom = await ChatModel.getChatroom(req.params.id);

    if (!isMember(req.user.id, chatroom)) return res.sendStatus(403);
    const message = await ChatModel.sendMessage(
        req.user.id,
        chatroom.id,
        req.body.text
    );

    const usersToNotify = chatroom.Users.map(u => u.id);
    const wsMessage =  { chatId: chatroom.id, from: req.user.id, username: req.user.username, text };

    WebsocketManager.sendMessage(usersToNotify,  { type: 'message', payload: wsMessage });
    res.status(201).json(message.id);
};

module.exports = {
    directChat,
    getChatroom,
    getUserChatrooms,
    sendMessage
};