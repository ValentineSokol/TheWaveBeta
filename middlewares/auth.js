const getUserFromSession = require('../utils/getUserFromSession');
module.exports = ( mandatory = true) => async (req, res, next) => {
    const userPromise = getUserFromSession(req);
    if (!userPromise && mandatory) {
        res.sendStatus(401);
        return;
    }
    if (userPromise) {
        const record = await userPromise;
        req.user = record?.dataValues;
    } else req.user = null;

    next();
}