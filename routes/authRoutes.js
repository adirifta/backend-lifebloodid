const express = require('express');
const bodyParser = require('body-parser');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(bodyParser.json());

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;