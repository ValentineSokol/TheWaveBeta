const { Users } = require('../models');
module.exports = async (req, res, next) => {
    if (!req.session || !req.session.passport || !req.session.passport.user) {
        res.sendStatus(401);
        return;
    }
    const userId = req.session.passport.user;
    req.user = await Users.findByPk(userId);
    next();
}