const { Router } = require('express');
const AuthProvider = require('./AuthProvider');
const {
    authenticateUser,
    logout,
    requestPasswordRecovery,
    recoverPassword
} = require('./AuthController');

const router = Router();
AuthProvider.init(router);

AuthProvider.initAuthStrategies().forEach(routes => {
  routes.forEach(route => {
    router[route.method](route.path, route.handler);
  });
});

router.post('/authenticate', authenticateUser);
router.delete('/logout', logout);
router.post('/password/requestRecovery', requestPasswordRecovery);
router.patch('/password/recover',  recoverPassword);

module.exports = router;