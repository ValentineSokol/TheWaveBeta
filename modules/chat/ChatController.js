const ChatModel = require('./ChatModel');
const UserModel = require('../user/UserModel');
const WebsocketManager = require('../websocket/WebsocketController');

const directChat = async (req, res) => {
    const { id } = await ChatModel.findOrCreateDirectChatroom(req.user, Number(req.params.companion));
    const chatroom = await ChatModel.getChatroom(id);
    res.json(chatroom);
};

const getChatroom = async (req, res) => {
    const chatroom = await ChatModel.getChatroom(req.params.id, req.user);
    if (!chatroom) return res.sendStatus(404);
    res.json(chatroom);
};

const getUserChatrooms = async (req, res) => {
    const chatrooms = await ChatModel.getUserChatrooms(req.user);
    const result = chatrooms.map((room) => {
        if (room.directChatroomHash) {
            const companion = room.members.length === 1 ?
                room.members[0]
                : room.members.find(member => member.id !== req.user);
            room.name = companion.username;
            room.avatarUrl = companion.avatarUrl;
            room.directWith = companion.id;
        }
        return { id: room.id, name: room.name, avatarUrl: room.avatarUrl, lastMessage: room.Messages[0], directWith: room.directWith };
    });
    res.json(result);
};

const sendMessage = async (req, res) => {
    const { text } = req.body;
    const chatroom = await ChatModel.getChatroom(req.params.id, req.user);
    if (!chatroom) return res.sendStatus(404);
    const message = await ChatModel.sendMessage(
        req.user,
        chatroom.id,
        req.body.text
    );

    const usersToNotify = chatroom.Users.map(u => u.id);
    const user = await UserModel.getUser(req.user);
    const wsMessage =  { chatId: chatroom.id, from: req.user.id, username: user.username, text };

    WebsocketManager.sendMessage(usersToNotify,  { type: 'message', payload: wsMessage });
    res.status(201).json(message.id);
};

module.exports = {
    directChat,
    getChatroom,
    getUserChatrooms,
    sendMessage
};