const { Router } = require('express');
const passport = require('passport');
const { Users, RecoveryCodes } = require('../models');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;

module.exports = (server) => {
    const router = Router();
    router.use(passport.initialize());
    router.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Users.findByPk(id)
            .then(function (user) { done(null, user); })
            .catch(done);
    });
    passport.use(new LocalStrategy(
        async function(username, password, done) {
            let user = await Users.findOne({ where: { username } });
            if (!user) {
                const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
                const [record, created] = await Users.findOrCreate({ where: { username }, defaults: { username, password: passwordHash } });
                if (!created) done(null, false);
                else done(null, record);
                return;
            }
            const passwordVerified = bcrypt.compareSync(password, user.password);
            if (!passwordVerified) {
                done(null, false);
                return;
            }
            done(null, user);


        }
    ));
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.DOMAIN}/auth/google/callback`
    },
    function(accessToken, refreshToken, profile, cb) {
        Users.findOrCreate({ where: { googleId: profile.id }, defaults: { googleId: profile.id, username: profile.displayName, email: profile.emails[0].value } })
        .then(([user]) => cb(null, user))
        .catch(err => cb(err, null));
    })); 

    passport.use(new VKontakteStrategy(
        {
        clientID: process.env.VK_CLIENT_ID,
        clientSecret: process.env.VK_CLIENT_SECRET,
        callbackURL: `${process.env.DOMAIN}/auth/vk/callback`
    },
    function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {
        Users.findOrCreate({ where: { vkId: profile.id }, defaults: { vkId: profile.id,  username: profile.displayName, email: profile.emails[0].value } })
            .then(([user]) =>  done(null, user))
            .catch(err => done(err, null));
        }
    ));
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: `${process.env.DOMAIN}/auth/facebook/callback`,
        profileFields: ['id', 'emails', 'name'] 
    },
    function(accessToken, refreshToken, profile, done) {
        Users.findOrCreate({ where: { facebookId: profile.id }, defaults: { facebookId: profile.id,  username: `${profile.name.givenName} ${profile.name.familyName}`, email: profile.emails? profile.emails[0].value : '' } })
        .then(([user]) =>  done(null, user))
        .catch(err => done(err, null));
    }
    ));
    router.post('/local', passport.authenticate('local'), (req, res) => res.json({ success: true }));
    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => res.json({ success: true }));
    router.get('/google/callback', passport.authenticate('google'));
    router.get('/vk', passport.authenticate('vkontakte', { scope: ['profile', 'email'] }));
    router.get('/vk/callback', passport.authenticate('vkontakte'));
    router.get('/facebook/', passport.authenticate('facebook', { scope: ['email', 'user_photos'] }));
    router.get('/facebook/callback', passport.authenticate('facebook'));
    router.get('/isLoggedIn', async (req, res) => {
        if (!req.session || !req.session.passport) {
            res.json({ isLoggedIn: false });
            return;
        }
        const userId = req.session.passport.user;
        const user = await Users.findByPk(userId);
        if (!user) {
            res.status(400).json({ reason: 'There is no user for given id!' });
            return;
        }
        res.json({
            isLoggedIn: true,
            username: user.username,
            userId: user.id
        });
    });
    router.delete('/logout', (req, res) => {
      req.logOut();
      res.json({ success: true }); 
    });
    router.put('/sendMail', async (req, res) => {
        const  { username } = req.body;
        const user = await Users.findOne({ where: { username } });
        if (!user) {
            res.status(404).json({
                reason: `No user with name ${username} found!`
            });
            return;
        }
        const recoveryCode = await RecoveryCodes.create({
            userId: user.id,
            code: crypto.randomBytes(16).toString('base64')
        }); 
        const message ={
            from: 'valentinesokolovskiy@gmail.com', // sender address
            to: user.email, // list of receivers
            subject: "TheWave Password Recovery", // Subject line
            html: `<h3>Dear, ${username}!</h3>
                   <p>You are seeing this email because someone requested a password recovery.</p>
                   <p><b style="color: red;">If you did not request it, just ignore this email!</b></p>
                   <p><b style="color: green;">Your recovery code is: ${recoveryCode.code}</b></p>     
            `, // html body
          }
         await server.emailer.sendMail(message);
         res.json({ success: true });
         
    })

    return router;
}