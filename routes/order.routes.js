const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { auth, adminAuth } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');
const { orderValidation } = require('../validation/schemas');

router.post('/', auth, validateRequest(orderValidation.create), orderController.create);
router.get('/', auth, orderController.getAllForUser);
router.put('/:id/status', adminAuth, orderController.updateStatus);
router.delete('/:id', adminAuth, orderController.delete);

module.exports = router;