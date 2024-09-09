// accountController.js
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Account = require('../models/account');

// Fungsi validasi akun
exports.registerAccountValidation = [
  body('pin')
    .isLength({ min: 4, max: 6 }).withMessage('PIN must be between 4 to 6 digits')
    .matches(/^[0-9]+$/).withMessage('PIN must only contain numbers')
];

// Fungsi untuk membuat akun
exports.registerAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { pin } = req.body;
    const hashedPin = await bcrypt.hash(pin, 10);
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);  // Generate nomor rekening

    const newAccount = await Account.create({
      accountNumber: accountNumber.toString(),
      pin: hashedPin,
      balance: 0,
      currency: 'USD',
      userId: req.user.userId
    });

    res.status(201).json({ message: 'Account created successfully', newAccount });
  } catch (error) {
    res.status(500).json({ message: 'Error creating account', error });
  }
};

// Fungsi untuk menampilkan daftar rekening milik pengguna yang login
exports.getUserAccounts = async (req, res) => {
    try {
      // Cari semua rekening berdasarkan userId dari JWT
      const accounts = await Account.findAll({
        where: { userId: req.user.userId },
        attributes: { exclude: ['pin'] }
      });
  
      if (accounts.length === 0) {
        return res.status(404).json({ message: 'No accounts found for this user' });
      }
  
      res.status(200).json(accounts);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving accounts', error });
    }
  };

  // Fungsi untuk menampilkan detail rekening berdasarkan accountId
exports.getAccountDetail = async (req, res) => {
    const { accountId } = req.params;
  
    try {
      // Cari rekening berdasarkan accountId
      const account = await Account.findOne({
        where: { id: accountId, userId: req.user.userId },
        attributes: { exclude: ['pin'] }
      });
  
      if (!account) {
        return res.status(404).json({ message: 'Account not found or you don\'t have access to this account' });
      }
  
      res.status(200).json(account);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving account detail', error });
    }
  };
  