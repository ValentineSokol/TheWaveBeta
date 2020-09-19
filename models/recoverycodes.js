'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RecoveryCodes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  RecoveryCodes.init({
    code: DataTypes.STRING,
    userId: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'RecoveryCodes',
  });
  return RecoveryCodes;
};