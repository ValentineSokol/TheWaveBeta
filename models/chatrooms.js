'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chatrooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      chatrooms.userAssociation = chatrooms.belongsToMany(models.Users, { through: models.ChatroomMembers, foreignKey: 'chatroomId', otherKey: 'memberId', as: 'members' });
      chatrooms.isMemberJoin = chatrooms.belongsToMany(models.Users, { through: models.ChatroomMembers, foreignKey: 'chatroomId', otherKey: 'memberId', as: 'isMember' });
      chatrooms.messagesAssociation = chatrooms.hasMany(models.Messages, { foreignKey: 'chatroom'})
    }
  };
  chatrooms.init({
    name: DataTypes.STRING,
    avatarUrl: DataTypes.STRING,
    directChatroomHash: {
      type: DataTypes.STRING,
      unique: true
    },
  }, {
    sequelize,
    modelName: 'Chatrooms',
  });
  return chatrooms;
};