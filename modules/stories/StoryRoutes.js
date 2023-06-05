const { Router } = require('express');

const { createStory, createCharacter, createFandom, search, getById} = require('./StoryController');
const AuthMiddleware = require("../../middlewares/auth");

const router = Router();

router.get('/:id', getById);
router.post('/', AuthMiddleware(),  createStory);
router.post('/fandoms', createFandom);
router.post('/characters', createCharacter);

router.post('/search', search);

module.exports = router;
