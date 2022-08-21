const ChatModel = require('./ChatModel');
const UserModel = require('../user/UserModel');
const WebsocketManager = require('../websocket/WebsocketController');

const directChat = async (req, res) => {
    const { id } = await ChatModel.findOrCreateDirectChatroom(req.user, Number(req.params.companion));
    const chatroom = await ChatModel.getChatroom(id, req.user);
    res.json(chatroom);
};

const getChatroom = async (req, res) => {
    const chatroom = await ChatModel.getChatroom(req.params.id, req.user);
    if (!chatroom) return res.sendStatus(404);
    res.json(chatroom);
};

const getUserChatrooms = async (req, res) => {
    const result = await ChatModel.getUserChatrooms(req.user);
    res.json(result);
};

const sendMessage = async (req, res) => {
    const { text } = req.body;
    const chatroom = await ChatModel.getChatroom(req.params.id, req.user, { withMembers: true });
    if (!chatroom) return res.sendStatus(404);
    const message = await ChatModel.sendMessage(
        req.user,
        chatroom.id,
        req.body.text
    );

    const usersToNotify = chatroom.members.map(u => u.id);
    const user = await UserModel.getUser(req.user);
    const wsMessage =  { chatId: chatroom.id, from: req.user, author: { username: user.username, avatarUrl: user.avatarUrl }, text };

    WebsocketManager.sendMessage(usersToNotify,  { type: 'message', payload: wsMessage });
    res.status(201).json(message.id);
};

module.exports = {
    directChat,
    getChatroom,
    getUserChatrooms,
    sendMessage
};