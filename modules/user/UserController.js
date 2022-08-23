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
    res.status(201).json({ user: user.id });
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
    const fieldsToUpdate = req.body  || {};
    const newAvatar = req?.files?.[0];
    if (newAvatar) {
        const [avatarUrl] = await FileModel.uploadFiles(req.files, req.user);
        if (avatarUrl) fieldsToUpdate.avatarUrl = avatarUrl;
    }

    const user = await UserModel.updateUser(req.user, fieldsToUpdate);
    res.json({ user });
}

module.exports = {
    register,
    getProfile,
    updateUser,
}