require('dotenv').config();
const express =  require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const SessionStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const bodyParser = require('body-parser');
const authRouter = require('./modules/auth/AuthRoutes');
const userRouter = require('./modules/user/UserRoutes');
const chatRouter = require('./modules/chat/ChatRoutes');
const fileRouter = require('./modules/files/FilesRoutes');
const searchRouter = require('./modules/search/SearchRoutes');
const storyRouter = require('./modules/stories/StoryRoutes');

const app = express();

app.use(cors( { origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
require('express-ws')(app);
const websocketRouter = require('./modules/websocket/Routes');


app.use(bodyParser.json());
app.use(express.static(`${__dirname}/client/build`));

app.listen(process.env.PORT || 5008, '0.0.0.0');


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
}
}));
sessionStore.sync();

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/chat', chatRouter);
app.use('/files', fileRouter);
app.use('/search', searchRouter);
app.use('/realtime', websocketRouter);
app.use('/stories', storyRouter);
