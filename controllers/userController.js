const User = require('../models/user');
const Account = require('../models/account');

// Fungsi untuk menampilkan data pengguna (user) yang sedang login
exports.getUserData = async (req, res) => {
  try {
    // Cari user berdasarkan userId dari JWT yang telah didekode
    const user = await User.findOne({
      where: { id: req.user.userId },
      attributes: ['firstName', 'lastName', 'username', 'email', 'dateOfBirth', 'address', 'role'], // Ambil atribut yang diperlukan saja
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user data', error });
  }
};

// Fungsi untuk menampilkan daftar nomor rekening, level, mata uang, dan nama pemilik
exports.getUserAccounts = async (req, res) => {
  try {
    // Cari semua rekening berdasarkan userId dari JWT
    const accounts = await Account.findAll({
      where: { userId: req.user.userId },
      attributes: ['accountNumber', 'level', 'currency'], // Ambil atribut yang diperlukan dari tabel Account
      include: {
        model: User, // Join dengan tabel User
        attributes: ['firstName', 'lastName'], // Ambil nama depan dan nama belakang dari tabel User
      }
    });

    if (accounts.length === 0) {
      return res.status(404).json({ message: 'No accounts found for this user' });
    }

    const accountsWithOwnerName = accounts.map(account => ({
      accountNumber: account.accountNumber,
      level: account.level,
      currency: account.currency,
      ownerName: `${account.User.firstName} ${account.User.lastName}`, // Gabungkan nama depan dan nama belakang
    }));

    res.status(200).json(accountsWithOwnerName);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving accounts', error });
  }
};
