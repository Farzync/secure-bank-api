'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hapus kolom pin dari tabel users
    await queryInterface.removeColumn('Users', 'pin');

    // Ubah role menjadi enum dengan opsi 'super-admin', 'admin', dan 'customer'
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('super-admin', 'admin', 'customer'),
      allowNull: false,
      defaultValue: 'customer'
    });
  },

  async down(queryInterface, Sequelize) {
    // Tambahkan kembali kolom pin jika migrasi di-rollback
    await queryInterface.addColumn('Users', 'pin', {
      type: Sequelize.STRING(64),
      allowNull: false
    });

    // Rollback role menjadi enum lama jika diperlukan
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('super-admin', 'admin', 'moderator', 'customer-services', 'company-cust', 'platinum-cust', 'gold-cust', 'silver-cust', 'broonze-cust'),
      allowNull: false
    });
  }
};
