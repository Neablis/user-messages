// packages
const {ApolloServer} = require('apollo-server-express');

// modules
const schema = require('./schema');

// Setup GraphQL
module.exports = (server) => {
  const context = ({req}) => ({
    session: req.session,
  });

  const apolloServer = new ApolloServer({schema, context});

  apolloServer.applyMiddleware({
    app: server,
    path: '/',
  });
};
