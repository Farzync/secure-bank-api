const AccountLevel = require('../models/accountlevel');

async function calculateTax(accountLevel, amount) {
  const levelData = await AccountLevel.findOne({ where: { level: accountLevel } });
  if (!levelData) {
    throw new Error('Account level not found');
  }
  return amount * levelData.taxRate;
}

async function checkMaxBalance(account, amountToAdd) {
  const levelData = await AccountLevel.findOne({ where: { level: account.level } });
  if (!levelData) {
    throw new Error('Account level not found');
  }
  const potentialBalance = account.balance + amountToAdd;
  if (potentialBalance > levelData.maxBalance) {
    throw new Error(`Account balance cannot exceed ${levelData.maxBalance} USD`);
  }
}

module.exports = {
  calculateTax,
  checkMaxBalance,
};
