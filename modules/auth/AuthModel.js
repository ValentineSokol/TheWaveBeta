const { RecoveryCodes } = require('../../models');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const generateRecoveryCode = async (userId) => {
    const record = await RecoveryCodes.create({
        userId,
        code: crypto.randomBytes(16).toString('base64')
    });
    return record.code;
};
const findRecordByCode = (code) => {
    return RecoveryCodes.findOne({ where: { code } });
};

const deleteRecoveryCode = (code) => RecoveryCodes.destroy({ where: { code } });

const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const verifyPassword = (string, hash) => {
    return bcrypt.compareSync(string, hash);
};

module.exports = {
    generateRecoveryCode,
    findRecordByCode,
    deleteRecoveryCode,
    hashPassword,
    verifyPassword
}