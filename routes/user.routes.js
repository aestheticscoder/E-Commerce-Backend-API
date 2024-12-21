const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validateRequest = require('../middleware/validate');
const { userValidation } = require('../validation/schemas');

router.post('/register', validateRequest(userValidation.register), userController.register);
router.post('/login', validateRequest(userValidation.login), userController.login);

module.exports = router;