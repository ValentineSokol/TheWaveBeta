const StoryModel = require('./StoryModel');

const createStory = async (req, res) => {
    const story = await StoryModel.createStory({ creator: req.user.id, name: req.body.name, description: req.body.description  });
    await Promise.all([
        StoryModel.addFandoms(story.id, req.body.fandoms),
        StoryModel.addCharacters(story.id, req.body.characters),
        StoryModel.postChapter(story.id, req.body.chapter)
    ]);

    res.status(201).json({ id: story.id });
}

const createFandom = async (req, res) => {
   const fandom = await StoryModel.createFandom(req.body);
   res.status(201).json({ id: fandom });
};

const createCharacter = async (req, res) => {
    const character = await StoryModel.createCharacter(req.body);
    res.status(201).json({ id: character });
};

const search = async (req, res) => {
  const { entity, query } = req.body;
  const filters = req.query;
  const locale = req.cookies?.NEXT_LOCALE;

  const matches = await StoryModel.search(entity, query, filters, locale);
  res.json({ matches });

}

const getById = async  (req, res) => {
    const { id } = req.params;
    const story = await StoryModel.getById(id);
    res.json({ story });
}
module.exports = { createStory, getById, createCharacter, createFandom, search };
