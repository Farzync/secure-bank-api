const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const transactionRoutes = require('./transactionRoutes');
const accountRoutes = require('./accountRoutes');
const userRoutes = require('./userRoutes');

// Routes
router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/account', accountRoutes); 
router.use('/user', userRoutes);

module.exports = router;
