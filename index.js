require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SessionStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const fileRouter = require('./routes/files');

const app = express();

require('express-ws')(app);

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/client/build`));

const server = app.listen(process.env.PORT || 5000, '0.0.0.0');
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
server.emailer = nodemailer.createTransport({
    service: "gmail", // no need to set host or port etc.
     auth: {
         user: process.env.GMAIL_USERNAME,
         pass: process.env.GMAIL_PASSWORD
     }
});
app.use('/auth', authRouter(server));
app.use('/users', userRouter(server));
app.use('/chat', chatRouter(server));
app.use('/files', fileRouter(server));
app.get('*', (req, res) => res.sendFile(`${__dirname}/client/build/index.html`));