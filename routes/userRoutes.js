const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { getUserData, getUserAccounts } = require('../controllers/userController');

const router = express.Router();

// Rute untuk mendapatkan data pengguna yang sedang login
router.get('/me', authenticate, getUserData);

// Route untuk mendapatkan daftar rekening pengguna
router.get('/accounts', authenticate, getUserAccounts);

module.exports = router;
