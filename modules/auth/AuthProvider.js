const passport = require('passport');
const UserModel = require('../user/UserModel');
const LocalStrategy = require('passport-local').Strategy;
const thirdPartyStrategies = require('./ThirdPartyAuthStrategies');
const { verifyPassword } = require('./auth');

const init = (router) => {
    router.use([ passport.initialize(), passport.session()]);
};

const initLocalStrategy = () => {
    passport.use(new LocalStrategy(
        async function(username, password, done) {
            let user = await UserModel.findByUsername(username, { paranoid: false });
            if (!user) {
                return done(null, false);
            }
            const passwordVerified = verifyPassword(password, user.password);
            if (!passwordVerified) {
                done(null, false);
                return;
            }
            done(null, user);
        }
    ));
    return [
        {
            path: '/local',
            method: 'post',
            handler: [
                passport.authenticate('local'),
                (req, res) => res.json({ success: true })
            ]
        }
        ];
};

const initThirdPartyStrategies = () => {
    thirdPartyStrategies.map((service) => {
       passport.use(new service.strategy({
           clientID: process.env[`${service.name.toUpperCase()}_CLIENT_ID`],
           clientSecret: process.env[`${service.name.toUpperCase()}_CLIENT_SECRET`],
           callbackURL: `${process.env.DOMAIN}/auth/${service.name}/callback`,
           ...options
       },
       async function(accessToken, refreshToken, profile, cb) {
               try {
                   const { user } = await UserModel.findOrCreateUser(
                       {
                           findBy: `${serviceName}Id`,
                           fields: { facebookId: profile.id },
                           isSocialLogin: true
                       });
                   return cb(null, user);
               }
               catch(err) {
                   cb(err, null);
               }
           }));

 return [
            {
                method: 'get',
                path: `/${service.name}`,
                handler: passport.authenticate(service.name, { scope: service.scope })
            },
            {
                method: 'get',
                path: `/${serviceName}/callback`,
                handler: passport.authenticate(service.name)
            }
        ];
    });
};

const initAuthStrategies = () => {
    const localStrategyRoutes = initLocalStrategy();
    const thirdPartyStrategyRoutes = initThirdPartyStrategies();
    return [...localStrategyRoutes, ...thirdPartyStrategyRoutes];
};

const getUserFromSession = (req) => req.session?.passport?.user;

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
    UserModel.getUser(id, { paranoid: false })
        .then((user) => done(null, user))
        .catch(done);
});

module.exports = {
    init,
    initAuthStrategies,
    getUserFromSession
};