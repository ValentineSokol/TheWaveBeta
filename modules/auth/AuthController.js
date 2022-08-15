const UserModel = require('../user/UserModel');
const AuthModel = require('./AuthModel');
const emailTemplates = require('../email/EmailTemplates');
const EmailManager = require('../email/EmailManager');

const logout = (req, res) => {
    req.logOut();
    res.json({ success: true });
};

const requestPasswordRecovery = async (req, res) => {
    const  { username } = req.body;
    const user = await UserModel.findByUsername(username, { paranoid: false });
    if (!user) {
        res.status(404).json({
            reason: `No user with name ${username} found!`
        });
        return;
    }
    const recoveryCode = await AuthModel.generateRecoveryCode(user.id);

    const email = emailTemplates.passwordRecovery(
        user.username,
        recoveryCode
    );
    await EmailManager.sendEmail(user.email, email);
    res.json({ success: true });
};

const recoverPassword = async (req, res) => {
    const { recoveryCode, username, password } = req.body;
    const userPromise = UserModel.findByUsername(username, { paranoid: false });
    const codePromise = AuthModel.findRecordByCode(recoveryCode);
    const [user, codeRecord] = await Promise.all([userPromise, codePromise]);
    if (!user || !codeRecord) return res.sendStatus(404);
    if (AuthModel.verifyPassword(password, user.password)) {
        res.status(400).json({
            reason: 'You cannot use your current password.'
        });
        await AuthModel.deleteRecoveryCode(recoveryCode);
        return;
    }
    if (codeRecord.userId !== user.id) return res.sendStatus(403);

    await Promise.all([
        AuthModel.deleteRecoveryCode(recoveryCode),
        UserModel.updateUser(user.id, { password: AuthModel.hashPassword(password) })
    ]);
    res.json({ success: true });
};
const authenticateUser = async (req, res) => {
    if (!req.user) {
        res.json({ isLoggedIn: false });
        return;
    }
    const user = await UserModel.getUser(req.user);
    if (!user) {
        res.status(404).json({ reason: 'There is no user for given id!' });
        return;
    }
    res.json({
        isLoggedIn: true,
        ...user.dataValues
    });
};

module.exports = {
    authenticateUser,
    logout,
    requestPasswordRecovery,
    recoverPassword
}