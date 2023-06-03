'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class fandoms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      fandoms.storyAssociation = fandoms.belongsToMany(models.stories, { through: models.storiesFandoms, foreignKey: 'fandomId', otherKey: 'storyId' })
      fandoms.characterAssociation = fandoms.hasMany(models.characters, { foreignKey: 'fandomId'});
    }
  }
  fandoms.init({
    name_en: DataTypes.STRING,
    name_uk: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'fandoms',
  });
  return fandoms;
};
