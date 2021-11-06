const { Router } = require('express');
const { Users } = require('../models');
const auth = require('../middlewares/auth');
const { createUser, hashPassword } = require('../utils/auth');

module.exports = (server) => {
    const router = Router();
    
    router.post('/', async (req, res) => {
        const { username, password, email = null } = req.body;
        const passwordHash = hashPassword(password);
        const { user, created } = await createUser({ findBy: 'username', fields: { username, password: passwordHash, email } });
        if (!created) {
            return res.status(400).json({ code: 'usr_occupied' });
        }
        res.json({ user: user.id });
    });
    router.get('/authenticate', async (req, res) => {
        if (!req.session || !req.session.passport || !req.session.passport.user) {
            res.json({ isLoggedIn: false });
            return;
        }
        const userId = req.session.passport.user;
        const user = await Users.findByPk(userId, {
            attributes: { exclude: ['password', 'googleId', 'vkId', 'facebookId'] },
            paranoid: false
        });
        if (!user) {
            res.status(400).json({ reason: 'There is no user for given id!' });
            return;
        }
        res.json({
            isLoggedIn: true,
            ...user.dataValues
        });
    });
    router.get('/:id', auth(false), async (req, res) => {
      const { id } = req.params;
      const requestOptions = {};
      if (req?.user?.id === Number(id)) {
          requestOptions.paranoid = false;
      }
      const user = await Users.findByPk(id, requestOptions);
      if (!user) {
          res.status(404).json({
              reason: 'No user with that id found!'
          });
          return;
      }
      res.json({ user });  
    });
    router.patch('/', auth(), async (req, res) => {
      const { avatarUrl } = req.body;
      const fieldsToUpdate = {};
      if (avatarUrl) fieldsToUpdate.avatarUrl = avatarUrl;
      const user = await Users.findByPk(req.user.id, { paranoid: false });
      await user.update(fieldsToUpdate, { paranoid: false });
      res.json({ id: req.user.id }) 
    });
    return router;
}