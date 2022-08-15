require('dotenv').config();
const express =  require('express');
const session = require('express-session');
const SessionStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const bodyParser = require('body-parser');
const authRouter = require('./modules/auth/AuthRoutes');
const userRouter = require('./modules/user/UserRoutes');
const chatRouter = require('./modules/chat/ChatRoutes');
const fileRouter = require('./modules/files/FilesRoutes');

const app = express();

require('express-ws')(app);

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/client/build`));

app.listen(process.env.PORT || 5000, '0.0.0.0');

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

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/chat', chatRouter);
app.use('/files', fileRouter);
app.use('/realtime',  require('./modules/websocket/Routes'));

app.get('*', (req, res) => res.sendFile(`${__dirname}/client/build/index.html`));