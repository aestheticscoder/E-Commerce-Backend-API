const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { auth, adminAuth } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');
const { productValidation } = require('../validation/schemas');

router.post('/', adminAuth, validateRequest(productValidation.create), productController.create);
router.put('/:id', adminAuth, validateRequest(productValidation.update), productController.update);
router.get('/', productController.getAll);
router.delete('/:id', adminAuth, productController.delete);

module.exports = router;
