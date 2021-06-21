'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'lastSeen', Sequelize.BIGINT);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'lastSeen');
  }
};
