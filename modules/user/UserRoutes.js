const { Router } = require('express');
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/fileUpload');
const Validators = require('../../validators/register.js');
const validate = require('../../middlewares/validate');
const {
    register,
    getProfile,
    updateUser,
    checkUsername
} = require('./UserController');

const router = Router();

router.post('/', validate(Validators.registerSchema, 'body'), register);
router.get('/:id', auth(false), getProfile);
router.get(
    '/username/:username/available',
    validate(Validators.checkUsername, 'params'),
    checkUsername
);
router.patch('/', auth(), upload, updateUser);

module.exports = router;
