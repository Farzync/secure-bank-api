'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Transactions', 'recipientAccountId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Karena hanya transfer yang memerlukan recipientAccountId
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Transactions', 'recipientAccountId');
  }
};
