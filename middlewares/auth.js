const { Users } = require('../models');
const getUserFromSession = require('../utils/getUserFromSession');
module.exports = async (req, res, next) => {
    const userPromise = getUserFromSession(req);
    if (!userPromise) {
        res.sendStatus(401);
        return;
    }
    req.user = await userPromise;
    next();
}