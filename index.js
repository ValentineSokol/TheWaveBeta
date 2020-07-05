const express = require('express');

const app = express();
app.use(express.static(`${__dirname}/client/build`));
app.get('*', (req, res) => res.sendFile(`${__dirname}/client/build/index.html`));
const server = app.listen(process.env.PORT || 4000, () => console.log('App running!'));