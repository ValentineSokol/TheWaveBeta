'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'vkontakteId', 'vkontakteId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'vkontakteId', 'vkontakteId');
  }
};
