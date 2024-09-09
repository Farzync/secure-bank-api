const { body } = require('express-validator');

exports.transactionValidation = [
  body('accountNumber').isNumeric().withMessage('Account number must be a number'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
];

exports.transferValidation = [
  body('senderAccountNumber').isNumeric().withMessage('Sender account number must be a number'),
  body('recipientAccountNumber').isNumeric().withMessage('Recipient account number must be a number'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
];
