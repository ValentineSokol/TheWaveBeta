const bcrypt = require('bcryptjs');
const { sequelize } = require('../models/index');
const { Users, Chatrooms } = require('../models');
module.exports = {
    hashPassword: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 
    },
    verifyPassword: function(string, hash) {
        return bcrypt.compareSync(string, hash);
    },
    createUser: async function ({ findBy, fields, isSocialLogin }) {
        const transaction = await sequelize.transaction();
        const defaults = { ...fields,  deletedAt: isSocialLogin ? Date.now() : null };
        try {
            const [record, created] = await Users.findOrCreate({
                where: {[findBy]: fields[findBy]},
                defaults,
                paranoid: false,
                transaction
            });

            const directChatroomHash = `${record.id}#${record.id}`;

            const [privateChatroom] = await Chatrooms.findOrCreate({
                where: { directChatroomHash },
                defaults: { directChatroomHash },
                paranoid: false,
                transaction
            });

            await privateChatroom.addUsers(record.id, {transaction});

            await transaction.commit();

            return { user: record, created };
        } catch (err) {
            console.error(err);
            await transaction.rollback();
            throw err;
        }
    }
}