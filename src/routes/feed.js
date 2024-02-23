const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feed');

router.get('/', feedController.getPublishedJobs);

module.exports = router;