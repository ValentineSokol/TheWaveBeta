const { Router } = require('express');
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/fileUpload');

const {
    register,
    getProfile,
    updateUser
} = require('./UserController');

const router = Router();
    
router.post('/', register);
router.get('/:id', auth(false), getProfile);
router.patch('/', auth(), upload, updateUser);

module.exports = router;
