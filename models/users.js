'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Users.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    privilege: DataTypes.ENUM('USER','ADMIN','MODERATOR'),
    googleId: DataTypes.STRING,
    vkId: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    instagramId: DataTypes.STRING,
    birthday: DataTypes.DATE,
    recoveryEmail: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};