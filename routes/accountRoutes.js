// accountRoutes.js
const express = require('express');
const router = express.Router();
const { registerAccount, registerAccountValidation, getUserAccounts, getAccountDetail } = require('../controllers/accountController');
const { authenticate } = require('../middleware/authMiddleware');

// Rute untuk menambahkan rekening baru setelah login
router.post('/register-account', authenticate, registerAccountValidation, registerAccount);

// Rute untuk mendapatkan daftar rekening pengguna
router.get('/accounts', authenticate, getUserAccounts);

// Rute untuk mendapatkan detail rekening tertentu berdasarkan accountId
router.get('/account/:accountId', authenticate, getAccountDetail);

module.exports = router;
