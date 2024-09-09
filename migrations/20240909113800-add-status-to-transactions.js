'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Transactions', 'status', {
      type: Sequelize.ENUM('pending', 'completed', 'failed'),  // Menambahkan status dengan tipe ENUM
      defaultValue: 'pending',  // Nilai default 'pending'
      allowNull: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Transactions', 'status');
  }
};
