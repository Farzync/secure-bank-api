const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); 

const AccountLevel = sequelize.define('AccountLevel', {
  level: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  taxRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  maxBalance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: false,  // Jika tidak memerlukan createdAt dan updatedAt
});

module.exports = AccountLevel;
