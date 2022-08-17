const { sequelize } = require('../../models/index');
const { Users, Chatrooms, Messages  } = require('../../models');

const getDirectChatroomHash = (userId, companionId) => {
    const ids = [userId, Number(companionId)];
    ids.sort((a, b) => b - a);
    return ids.join('#');
};

const findOrCreateChatroom = async (payload, members, options = {}) => {
    const [chatroom, created] = await Chatrooms.findOrCreate({
        where: payload,
        defaults: payload,
        ...options
    });
    if (!created) return chatroom;
    chatroom.addUsers(members);
    return chatroom;
};

const findOrCreateDirectChatroom = async (userId, companionId, options = {}) => {
    const transaction = options.transaction || await sequelize.transaction();
    const directChatroomHash = getDirectChatroomHash(userId, companionId);
    const members = userId === companionId ? [userId] : [userId, companionId];
    let chatroom;
    try {
        chatroom = await findOrCreateChatroom({ directChatroomHash }, members, { transaction });
        if (!options.transaction) await transaction.commit();
        return chatroom;
    }
    catch (err) {
        if (!options.transaction) await transaction.rollback();
        throw err;
    }
};

const getChatroom = (id) => {
    return Chatrooms.findByPk(
        id,
        {
            include: [
                { model: Users, required: false },
                { model: Messages, required: false }
            ]
        }
    );
}

const getUserChatrooms = (userId) => {
    return Chatrooms.findAll({
       include: [
         {
           model: Users,
           where: { id: userId }
         },
         {
            model: Messages,
            required: false,
            limit: 1,
            separate: true,
            order: [ ['createdAt', 'DESC'] ]
         }
       ]
    });
};

const sendMessage = (userId, chatroomId, text) => {
    return Messages.create({
        chatroom: chatroomId,
        from: userId,
        text
    });
};

module.exports = {
    findOrCreateChatroom,
    findOrCreateDirectChatroom,
    getChatroom,
    getUserChatrooms,
    sendMessage,
};