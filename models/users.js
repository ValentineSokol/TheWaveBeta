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
    static findByUsername(username = '') {
      return this.findOne({ where: { username } });
    }
  };
  Users.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    privilege: {
      type: DataTypes.ENUM('User','Admin'),
      defaultValue: 'User',
      allowNull: false
    }, 
    googleId: DataTypes.STRING,
    vkId: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    birthday: DataTypes.DATE,
    recoveryEmail: DataTypes.STRING,
    avatarUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};