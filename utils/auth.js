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
    createUser: async function ({ findBy, fields }) {
        const transaction = await sequelize.transaction();

        try {
            const [record, created] = await Users.findOrCreate({
                where: { [findBy]: fields[findBy] },
                defaults: fields,
                transaction
            });

            const privateChatroom = await Chatrooms.create({
                directChatroomHash: `${record.id}#${record.id}`
            }, { transaction });

            await privateChatroom.addUsers(record.id, { transaction });

            await transaction.commit();

            return { record, created };
        }
        catch (err) {
            console.error(err);
            await transaction.rollback();
            throw err;
        }
    }
}