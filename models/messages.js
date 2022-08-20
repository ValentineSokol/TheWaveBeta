'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      messages.belongsTo(models.Users, { foreignKey: 'from' })
    }
  };
  messages.init({
    from: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    chatroom: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Messages',
  });
  return messages;
};