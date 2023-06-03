const { Router } = require('express');

const { createStory, createCharacter, createFandom, search} = require('./StoryController');

const router = Router();

router.post('/', createStory);
router.post('/fandoms', createFandom);
router.post('/characters', createCharacter);

router.post('/search', search);

module.exports = router;
