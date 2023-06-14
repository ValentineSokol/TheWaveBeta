const { Users } = require('../../models');
const ChatModel = require('../chat/ChatModel');
const { sequelize } = require('../../models/index');
const {Op} = require("sequelize");
const { stories, fandoms, characters } = require('../../models');

const excludedFields = ['password', 'googleId', 'vkontakteId', 'facebookId'];
const commonReqOptions = { attributes: { exclude: excludedFields }};

const findOrCreateUser = async function ({ findBy, fields, isSocialLogin }) {
    const transaction = await sequelize.transaction();
    const defaults = { ...fields,  deletedAt: isSocialLogin ? Date.now() : null };
    try {
        const [user, created] = await Users.findOrCreate({
            where: {[findBy]: fields[findBy]},
            defaults,
            paranoid: false,
            transaction
        });

        await ChatModel.findOrCreateDirectChatroom(user.id, user.id, { transaction });

        await transaction.commit();

        return { user, created };
    } catch (err) {
        console.error(err);
        await transaction.rollback();
        throw err;
    }
};
const findByUsername = (username, { paranoid = true } = {}) => {
    return Users.findOne({ where: { username }, paranoid })
}
const findAllByUsername = async (username, options) => {
    const users = await Users.findAll({ where: { username: { [Op.like]: `%${username}%` } }, paranoid: false, attributes: ['id', 'username', 'avatarUrl'], ...options });
    return users.map(user => ({ entity: 'user', ...user.dataValues }));
}
const getUser = async (id, { paranoid = true } = {}) => {
return Users.findByPk(id, {
    ...commonReqOptions,
    include: [{ model: stories, include: [ fandoms, characters ] }],
    paranoid
});
};
const updateUser = async (id, fieldsToUpdate) => {
    const user = await getUser(id);
    return user.update(fieldsToUpdate);
};

const sanitizeUserObj = ({ dataValues }) => {
    const result = { ...dataValues };
    excludedFields.forEach((field) => {
        delete result[field];
    });
    return result;
}

module.exports = {
    findOrCreateUser,
    findByUsername,
    findAllByUsername,
    getUser,
    updateUser,
    sanitizeUserObj
};
