const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Account = require('./account');

const Transaction = sequelize.define('Transaction', {
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Accounts', // Nama tabel yang dirujuk
      key: 'id'
    }
  },
  recipientAccountId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Null untuk setor dan tarik tunai
    references: {
      model: 'Accounts',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  transactionType: {
    type: DataTypes.ENUM('deposit', 'withdraw', 'transfer'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true, // Tambahkan createdAt dan updatedAt
  tableName: 'Transactions'
});

// Relasi dengan akun
Transaction.belongsTo(Account, { as: 'SenderAccount', foreignKey: 'accountId' });
Transaction.belongsTo(Account, { as: 'RecipientAccount', foreignKey: 'recipientAccountId' });

module.exports = Transaction;
