'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('characters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name_en: {
        allowNull: false,
        type: Sequelize.STRING
      },
      name_uk: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fandomId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'fandoms',
          key: 'id',
        }
      },
      sex: {
        allowNull: false,
        type: Sequelize.ENUM('M', 'F', 'UNKNOWN')
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('characters');
  }
};
