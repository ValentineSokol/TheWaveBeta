const { Router } = require('express');
const { Users } = require('../models');
module.exports = (server) => {
    const router = Router();
    router.get('/profile/:id', async (req, res) => {
      const { id } = req.params;
      const user = await Users.findByPk(id);
      if (!user) {
          res.status(404).json({
              reason: 'No user with that id found!'
          });
          return;
      }
      res.json({ user });  
    });
    return router;
}