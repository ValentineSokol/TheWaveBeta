const { Users } = require('../models');

module.exports = req => {
    if (!req.session || !req.session.passport || !req.session.passport.user) {
        return false;
    }
    const userId = req.session.passport.user;
    return Users.findByPk(userId, { paranoid: false });
}