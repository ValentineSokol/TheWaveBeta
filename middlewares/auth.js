const AuthProvider = require('../modules/auth/AuthProvider');

module.exports = ( mandatory = true) => async (req, res, next) => {
    req.user = AuthProvider.getUserFromSession(req);
    if (!userId && mandatory) return res.sendStatus(401);
    next();
}