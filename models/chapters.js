'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chapters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      chapters.belongsTo(models.stories, { foreignKey: 'storyId' });
    }
  }
  chapters.init({
    storyId: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    notes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'chapters',
  });
  return chapters;
};
