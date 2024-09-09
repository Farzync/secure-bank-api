const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware untuk validasi input registrasi
exports.registerValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('dateOfBirth').isDate().withMessage('Valid date of birth is required'),
  body('address').notEmpty().withMessage('Address is required')
];

// Fungsi untuk registrasi pengguna baru
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, username, email, password, dateOfBirth, address } = req.body;

  try {
    // Cari apakah email atau username sudah terdaftar
    const existingUserByEmail = await User.findOne({ where: { email } });
    const existingUserByUsername = await User.findOne({ where: { username } });

    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      dateOfBirth,
      address,
      role: 'customer' // Default role is customer
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    // Tangani error unik dari Sequelize
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Error registering user',
        error: error.errors.map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Fungsi untuk login pengguna
exports.loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};
