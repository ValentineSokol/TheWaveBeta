const { stories, storiesFandoms, storiesCharacters, chapters, fandoms, characters } = require('../../models');
const {Op} = require("sequelize");

const createStory = (body) => stories.create(body);

const getById = (id) => stories.findByPk(id, { include: [fandoms, characters, chapters] });
const addFandoms = async (storyId, fandomIds) => {
    const promises = fandomIds.map((fandomId) => {
       return storiesFandoms.create({ storyId, fandomId });
    });
    return Promise.all(promises);
}

const addCharacters = async (storyId, characterIds) => {
    const promises = characterIds.map((characterId) => {
        return storiesCharacters.create({ storyId, characterId });
    });
    return Promise.all(promises);
}

const createFandom = async (data) => fandoms.create(data);
const createCharacter = async (data) => characters.create(data);

const postChapter = async (storyId, body) => {
    return chapters.create({ storyId, ...body });
}
const search = async (entity, query, filters) => {
  const locales = ['en', 'uk'];
  const fuzzyQuery = { [Op.like]: `%${query}%` };
  const i18nQuery = (filterQueries) => ({ [Op.or]: locales.map(locale => ({ [`name_${locale}`]: fuzzyQuery, ...filterQueries }))  });

  const limit = 15;

  if (entity === 'story') {
    return stories.findAll({ where: { ...filters, [Op.or]:  [{ name: fuzzyQuery  }, { description: fuzzyQuery }] }, limit })
  }
  if (entity === 'fandom') {
      return fandoms.findAll({ where: i18nQuery(), limit });
  }

  if (entity === 'character') {
      const fandomIds = filters?.fandoms && Array.from(filters?.fandoms);
      const queryFilters = fandomIds ? { fandomId: { [Op.in]: fandomIds } } : {}
      return characters.findAll({ where: i18nQuery(queryFilters), include: [fandoms], limit });
  }
};

module.exports = { getById, createStory, addFandoms, addCharacters, postChapter, createFandom, createCharacter, search };
