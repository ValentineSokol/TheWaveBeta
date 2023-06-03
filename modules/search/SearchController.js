const UserModel = require('../user/UserModel');
const search = async (req, res) => {
    const { query } = req.params;
    const matches = await UserModel.findAllByUsername(query, { limit: 10 });
    res.json({ matches })
}

module.exports = { search };
