const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./user');

const Account = sequelize.define('Account', {
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  pin: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD'
  },
  level: {
    type: DataTypes.ENUM('platinum', 'gold', 'silver', 'blue'),
    allowNull: false,
    defaultValue: 'blue'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'Accounts'
});

Account.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Account, { foreignKey: 'userId', as: 'accounts' });

module.exports = Account;
