// Packages
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const connect = require('connect-redis');

// modules
const redis = require('./utils/redis');

const RedisStore = connect(session);

const setupGraphQL = require('./utils/graphql');

require('dotenv').config();

console.log('Web Server started');

const app = express();

app.use(morgan('combined'));
app.use(
  session({
    store: new RedisStore({client: redis}),
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
  }),
);

const PORT = process.env.PORT || 3000;

setupGraphQL(app);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

