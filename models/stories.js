'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      stories.fandomsAssociation = stories.belongsToMany(models.fandoms, { through: models.storiesFandoms, foreignKey: 'storyId', otherKey: 'fandomId' });
      stories.characterAssociation = stories.belongsToMany(models.characters, { through: models.storiesCharacters, foreignKey: 'storyId', otherKey: 'characterId' });
      stories.belongsToMany(models.Users, { through: models.storiesLikes, foreignKey: 'storyId', otherKey: 'userId', as: 'userLikes' });
      stories.belongsTo(models.Users, { foreignKey: 'creator' });

    }
  }
  stories.init({
    name: DataTypes.STRING,
    coverUrl: DataTypes.STRING,
    description: DataTypes.STRING,
    creator: DataTypes.INTEGER,
    likes: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    lang: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'stories',
  });
  return stories;
};
