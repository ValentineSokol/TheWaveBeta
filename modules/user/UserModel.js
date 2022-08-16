const { Users } = require('../../models');
const ChatModel = require('../chat/ChatModel');
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
const getUser = async (id, { paranoid = true } = {}) => {
return Users.findByPk(id, {
    ...commonReqOptions,
    paranoid
});
};
const updateUser = async (id, fieldsToUpdate) => {
    const user = await getUser(id);
    return user.update(fieldsToUpdate);
};

module.exports = {
    findOrCreateUser,
    findByUsername,
    getUser,
    updateUser
};