const express = require('express');

const router = express.Router();
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');

// Define the /status and /stats routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.get('/users', UsersController.postNew);

module.exports = router;
