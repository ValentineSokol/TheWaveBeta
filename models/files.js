'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Files extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Files.init({
    fileId: { type: DataTypes.STRING, allowNull: false },
    name: DataTypes.STRING,
    owner: DataTypes.INTEGER,
    visibility: DataTypes.ENUM(['public', 'private', 'friendsOnly']),
    nsfw: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    mimeType: DataTypes.STRING,
    toBeDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Files',
  });
  return Files;
};