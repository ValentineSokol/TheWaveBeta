require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
const app = express();
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/client/build`));

const server = app.listen(process.env.PORT || 4000, () => console.log('App running!'));
app.use('/auth', authRouter(server));
app.get('*', (req, res) => res.sendFile(`${__dirname}/client/build/index.html`));