const express = require('express');
const { registerUser, registerValidation, loginUser, loginValidation } = require('../controllers/authController');
const router = express.Router();

// Registrasi dan login
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

module.exports = router;
