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
      Users.belongsToMany(models.Chatrooms, { through: models.ChatroomMembers, otherKey: 'chatroomId', foreignKey: 'memberId' });
      Users.hasMany(models.Files, { foreignKey: 'owner' });
      Users.hasMany(models.Messages, { foreignKey: 'from' });
    }
  }
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
    vkontakteId: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    birthday: DataTypes.DATE,
    recoveryEmail: DataTypes.STRING,
    avatarUrl: DataTypes.STRING,
    lastSeen: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'Users',
    paranoid: true
  });
  return Users;
};