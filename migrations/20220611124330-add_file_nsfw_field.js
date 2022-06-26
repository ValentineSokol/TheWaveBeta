'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Files', 'nsfw', { type: Sequelize.BOOLEAN, defaultValue: 0 });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Files', 'nsfw');
  }
};
