'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('AccountLevels', [
      {
        level: 'blue',
        taxRate: 0.07,
        maxBalance: 20000
      },
      {
        level: 'silver',
        taxRate: 0.055,
        maxBalance: 40000
      },
      {
        level: 'gold',
        taxRate: 0.045,
        maxBalance: 60000
      },
      {
        level: 'platinum',
        taxRate: 0.025,
        maxBalance: 100000
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('AccountLevels', null, {});
  }
};
