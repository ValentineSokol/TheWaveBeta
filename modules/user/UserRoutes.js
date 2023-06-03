const { Router } = require('express');
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/fileUpload');
const Validators = require('../../validators/register.js');
const validate = require('../../middlewares/validate');
const {
    register,
    getCurrentUser,
    getProfile,
    updateUser,
    checkUsername
} = require('./UserController');
const AuthProvider = require("passport");
const AuthMiddleware = require("../../middlewares/auth");

const router = Router();

AuthProvider.init(router);

router.get('/current', AuthMiddleware(false), getCurrentUser);
router.post('/', validate(Validators.registerSchema, 'body'), register);
router.get('/:id', auth(false), getProfile);
router.get(
    '/username/:username/available',
    validate(Validators.checkUsername, 'params'),
    checkUsername
);
router.patch('/', auth(), upload, updateUser);

module.exports = router;
