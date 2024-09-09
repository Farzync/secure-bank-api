const bcrypt = require('bcryptjs');
const Account = require('../models/account');
const Transaction = require('../models/transaction');
const { calculateTax, checkMaxBalance } = require('../utils/accountUtils');
require('dotenv').config(); // pastikan dotenv di-import

// Ambil nomor rekening admin dari .env
const adminAccountNumber = process.env.ADMIN_ACCOUNT_NUMBER;

// Fungsi untuk setor tunai dengan verifikasi PIN
exports.deposit = async (req, res) => {
  const { accountNumber, amount, pin } = req.body;

  try {
    const account = await Account.findOne({ where: { accountNumber } });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Verifikasi PIN
    const isPinMatch = await bcrypt.compare(pin, account.pin);
    if (!isPinMatch) {
      return res.status(403).json({ message: 'Incorrect PIN' });
    }

    if (parseFloat(amount) <= 0) {
      return res.status(400).json({ message: 'Invalid amount. Must be greater than zero' });
    }

    // Cek apakah melebihi batas maksimum saldo
    await checkMaxBalance(account, parseFloat(amount));

    account.balance += parseFloat(amount);
    await account.save();

    await Transaction.create({
      accountId: account.id,
      amount,
      transactionType: 'deposit',
      transactionStatus: 'completed',
      description: 'Deposit',
    });

    res.status(200).json({ message: 'Deposit successful', balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: 'Error during deposit', error: error.message });
  }
};

// Fungsi untuk tarik tunai dengan verifikasi PIN
exports.withdraw = async (req, res) => {
  const { accountNumber, amount, pin } = req.body;

  try {
    const account = await Account.findOne({ where: { accountNumber } });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Verifikasi PIN
    const isPinMatch = await bcrypt.compare(pin, account.pin);
    if (!isPinMatch) {
      return res.status(403).json({ message: 'Incorrect PIN' });
    }

    if (parseFloat(amount) <= 0) {
      return res.status(400).json({ message: 'Invalid amount. Must be greater than zero' });
    }

    if (account.balance < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    account.balance -= parseFloat(amount);
    await account.save();

    await Transaction.create({
      accountId: account.id,
      amount,
      transactionType: 'withdraw',
      transactionStatus: 'completed',
      description: 'Withdrawal',
    });

    res.status(200).json({ message: 'Withdrawal successful', balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: 'Error during withdrawal', error: error.message });
  }
};

// Fungsi untuk transfer dengan pajak dan verifikasi PIN
exports.transfer = async (req, res) => {
  const { senderAccountNumber, recipientAccountNumber, amount, pin } = req.body;

  try {
    const senderAccount = await Account.findOne({ where: { accountNumber: senderAccountNumber } });
    const recipientAccount = await Account.findOne({ where: { accountNumber: recipientAccountNumber } });
    const adminAccount = await Account.findOne({ where: { accountNumber: adminAccountNumber } });

    if (!senderAccount || !recipientAccount || !adminAccount) {
      return res.status(404).json({ message: 'Sender, recipient, or admin account not found' });
    }

    // Verifikasi PIN
    const isPinMatch = await bcrypt.compare(pin, senderAccount.pin);
    if (!isPinMatch) {
      return res.status(403).json({ message: 'Incorrect PIN' });
    }

    if (senderAccount.balance < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    const taxAmount = await calculateTax(senderAccount.level, parseFloat(amount));
    const totalDeduction = parseFloat(amount) + taxAmount;

    if (senderAccount.balance < totalDeduction) {
      return res.status(400).json({ message: 'Insufficient funds for transfer and tax' });
    }

    // Periksa apakah penerima akan melebihi batas saldo setelah menerima uang
    await checkMaxBalance(recipientAccount, parseFloat(amount));

    // Update saldo pengirim
    senderAccount.balance -= totalDeduction;
    await senderAccount.save();

    // Update saldo penerima
    recipientAccount.balance += parseFloat(amount);
    await recipientAccount.save();

    // Transfer pajak ke rekening admin
    adminAccount.balance += taxAmount;
    await adminAccount.save();

    // Buat transaksi transfer
    await Transaction.create({
      accountId: senderAccount.id,
      recipientAccountId: recipientAccount.id,
      amount,
      transactionType: 'transfer',
      transactionStatus: 'completed',
      description: 'Transfer with tax',
    });

    // Buat transaksi pajak
    await Transaction.create({
      accountId: senderAccount.id,
      recipientAccountId: adminAccount.id,
      amount: taxAmount,
      transactionType: 'tax',
      transactionStatus: 'completed',
      description: `Tax for transfer of ${amount}`,
    });

    res.status(200).json({ 
      message: 'Transfer successful with tax', 
      amountSent: parseFloat(amount),  
      taxAmount: parseFloat(taxAmount.toFixed(2)),  
      senderBalance: senderAccount.balance
    });

  } catch (error) {
    res.status(500).json({ message: 'Error during transfer', error: error.message });
  }
};
