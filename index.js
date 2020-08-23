require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const SessionStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const db = require('./models/index');
const { Users } = require('./models');
const { Router } = require('express');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/client/build`));
const sessionStore = new SessionStore({ db: db.sequelize });
app.use(session({
secret: process.env.SESSION_SECRET,
store: sessionStore,
saveUninitialized: false,
rolling: false,
resave: false,
cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    httpOnly: true,
    sameSite: 'strict'
}
}));
sessionStore.sync();
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Users.findByPk(id)
        .then(function (user) { done(null, user); })
        .catch(done);
});
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
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google'));
app.get('/auth/vk/', passport.authenticate('vkontakte', { scope: ['profile', 'email'] }));
app.get('/auth/vk/callback', passport.authenticate('vkontakte'));
app.get('/auth/facebook/', passport.authenticate('facebook', { scope: ['email', 'user_photos'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook'));

app.get('*', (req, res) => res.sendFile(`${__dirname}/client/build/index.html`));
const server = app.listen(process.env.PORT || 4000, () => console.log('App running!'));