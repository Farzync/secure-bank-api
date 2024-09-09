'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Tambahkan kolom level ke tabel accounts
    await queryInterface.addColumn('Accounts', 'level', {
      type: Sequelize.ENUM('platinum', 'gold', 'silver', 'blue'),
      allowNull: false,
      defaultValue: 'blue'
    });
  },

  async down(queryInterface, Sequelize) {
    // Hapus kolom level jika migrasi di-rollback
    await queryInterface.removeColumn('Accounts', 'level');
  }
};
