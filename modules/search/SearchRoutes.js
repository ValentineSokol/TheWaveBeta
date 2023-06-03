const { Router } = require('express');

const { search } = require('./SearchController');

const router = Router();

router.get('/:query', search);

module.exports = router;
