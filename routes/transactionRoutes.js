const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { deposit, withdraw, transfer } = require('../controllers/transactionController');
const { transactionValidation, transferValidation } = require('../middleware/transactionValidation');

const router = express.Router();

router.post('/deposit', authenticate, transactionValidation, deposit);
router.post('/withdraw', authenticate, transactionValidation, withdraw);
router.post('/transfer', authenticate, transferValidation, transfer);

module.exports = router;
