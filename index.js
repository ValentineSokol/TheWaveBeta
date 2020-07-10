require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const SessionStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const db = require('./models/index');
const { Users } = require('./models');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const VKontakteStrategy = require('passport-vk-strategy').Strategy;

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
    secure: process.env.NODE_ENV == 'production',
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
  async function(accessToken, refreshToken, profile, cb) {
    let err;
    try {
     const [user] = await Users.findOrCreate({ where: { googleId: profile.id }, defaults: { googleId: profile.id, username: profile.displayName } });
    }
    catch(e) {
      err = e;
      console.error(err);
    }
    cb(err, user);
 })); 
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('*', (req, res) => res.sendFile(`${__dirname}/client/build/index.html`));
const server = app.listen(process.env.PORT || 4000, () => console.log('App running!'));