'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
    queryInterface.removeColumn(
        'Chatrooms',
        'isDirect'
    ),
    queryInterface.removeColumn('Chatrooms', 'maxMembers')
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
          'Chatrooms',
          'isDirect',
          Sequelize.BOOLEAN
      ),
      queryInterface.addColumn('Chatrooms', 'maxMembers', Sequelize.INTEGER)
    ]);
  }
};
