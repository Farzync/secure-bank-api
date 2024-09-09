'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      pin: {
        type: Sequelize.STRING(64), // Set the length of PIN to 64 characters
        allowNull: false
      },
      balance: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'USD'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Make sure this matches your Users table
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Accounts');
  }
};
