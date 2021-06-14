'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class directMessages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      directMessages.belongsTo(models.Users, { as: 'sender', foreignKey: 'from' });
      directMessages.belongsTo(models.Users, { as: 'addressee', foreignKey: 'to' });
    }
  }
  directMessages.init({
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    text: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'directMessages',
  });
  return directMessages;
};