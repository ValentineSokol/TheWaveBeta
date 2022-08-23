const { sequelize } = require('../../models/index');
const { Op, col } = require("sequelize");
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
    chatroom.addMembers(members);
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

const getChatroom = (id, userId, { withMembers } = {}) => {
    const include = [
        {
            model: Users,
            as: 'isMember',
            where: { id: userId }
        },
        {
            model: Messages,
            include: {
                model: Users,
                as: 'author',
                attributes: ['id', 'username', 'avatarUrl']
            },
            required: false
        }
    ];
    if (withMembers) {
        include.push({ model: Users, as: 'members' });
    }
    return Chatrooms.findByPk(
        id,
        {
            include
        }
    );
}
const getUserChatrooms = (userId) => {
    return Chatrooms.findAll({
       include: [
         {
           model: Users,
           where: { id: userId },
           attributes: [],
           as: 'isMember',
         },
         {
               model: Users,
               where: {
                 '$Chatrooms.directChatroomHash$': { [Op.ne]: null },
                   id: { [Op.ne]: userId }
               },
               required: false,
               attributes: ['username', 'avatarUrl'],
               through: { attributes: [] },
               as: 'members',
         },
         {
            model: Messages,
            include: [
                { model: Users, as: 'author', attributes: ['username'] }
            ],
            required: false,
            limit: 1,
            order: [ ['createdAt', 'DESC'] ]
         }
       ]
    });
};
const getUserDirectChatrooms = (userId) => {
    return Chatrooms.findAll({
        where: { directChatroomHash: { [Op.ne]: null } },
        include: [
            {
                model: Users,
                where: { id: userId },
                attributes: [],
                as: 'isMember',
            },
            {
                model: Users,
                attributes: ['username', 'avatarUrl'],
                as: 'members',
            },
            {
                model: Messages,
                required: false,
                limit: 1,
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