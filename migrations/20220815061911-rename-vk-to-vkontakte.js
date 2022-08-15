'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'vkId', 'vkontakteId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'vkontakteId', 'vkId');
  }
};
