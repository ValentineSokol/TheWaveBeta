'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class characters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      characters.fandomAssociation = characters.belongsTo(models.fandoms, { foreignKey: 'fandomId' });
      characters.storyAssociation = characters.belongsToMany(models.stories, { through: models.storiesCharacters, foreignKey: 'characterId', otherKey: 'storyId' });

    }
  }
  characters.init({
    name_en: DataTypes.STRING,
    name_uk: DataTypes.STRING,
    fandomId: DataTypes.INTEGER,
    sex: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'characters',
  });
  return characters;
};
