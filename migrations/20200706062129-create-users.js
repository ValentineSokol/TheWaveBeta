'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      privilege: {
        type: Sequelize.ENUM('USER','ADMIN','MODERATOR')
      },
      googleId: {
        type: Sequelize.STRING
      },
      vkId: {
        type: Sequelize.STRING
      },
      facebookId: {
        type: Sequelize.STRING
      },
       instagramId: {
        type: Sequelize.STRING
      },
      birthday: {
        type: Sequelize.DATE
      },
      recoveryEmail: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};