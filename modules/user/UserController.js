const UserModel = require('./UserModel');
const FileModel = require('../files/FileModel');
const AuthModel = require('../auth/AuthModel');

const register = async (req, res) => {
    const { username, password, email = null } = req.body;
    const passwordHash = AuthModel.hashPassword(password);
    const { user, created } = await UserModel.findOrCreateUser({
        findBy: 'username',
        fields: { username, password: passwordHash, email }
    });
    if (!created) {
        return res.status(400).json({ code: 'usr_occupied' });
    }
    res.json({ user: user.id });
};
const getProfile = async (req, res) => {
    const { id } = req.params;

    const user = await UserModel.getUser(id, { paranoid: id !== req?.user?.id });
    if (!user) {
        return res.status(404).json({
            reason: 'No user with that id found!'
        });
    }
    res.json({ user });
};
const updateUser = async (req, res) => {
    const fieldsToUpdate = {};
    const [newAvatar] = req.files;
    if (newAvatar) {
        const [avatarUrl] = await FileModel.uploadFiles(req.files, req.user.id);
        if (avatarUrl) fieldsToUpdate.avatarUrl = avatarUrl;
    }

    await UserModel.updateUser(req.user.id, fieldsToUpdate);
    res.json({ id: req.user.id });
}

module.exports = {
    register,
    getProfile,
    updateUser,
}