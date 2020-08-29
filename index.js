require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const authRouter = require('./routes/auth');
const app = express();
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/client/build`));

const server = app.listen(process.env.PORT || 4000, () => console.log('App running!'));
server.emailer = nodemailer.createTransport({
    service: "SendinBlue", // no need to set host or port etc.
     auth: {
         user: process.env.SENDINBLUE_USERNAME,
         pass: process.env.SENDINBLUE_PASSWORD
     }
});
app.use('/auth', authRouter(server));
app.get('*', (req, res) => res.sendFile(`${__dirname}/client/build/index.html`));