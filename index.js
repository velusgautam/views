require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
const cors = require('cors');
const app = express();
const router = require('./router.js');

// const counter = {};
// let CORS_SITES = ['https://www.hectane.com', 'https://hectane.com', 'https://admin.hectane.com', /\.velusgautam.vercel\.app$/];
// if (process.env.IS_LOCAL === 'true') {
CORS_SITES = '*';
// }
app.use(
  cors({
    origin: CORS_SITES,
    methods: 'GET',
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

const connectWithRetry = () => {
  console.log('MongoDB connection with retry');
  mongoose
    .connect(process.env.MONGODB_URI, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('MongoDB is connected');
    })
    .catch((err) => {
      console.log('MongoDB connection unsuccessful, retry after 5 seconds.');
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.use(router);

if (process.env.IS_LOCAL === 'true') {
  app.listen(3200, () => console.log(`Example app listening on port ${3200}!`));
}

module.exports = app;
