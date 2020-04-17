const {GraphQLObjectType} = require('graphql');

const users = require('../../modules/users/queries');
const messages = require('../../modules/messages/queries');

// Query
const query = new GraphQLObjectType({
  name: 'query',
  description: 'API Queries [Read]',

  fields: () => ({
    ...users,
    ...messages,
  }),
});

module.exports = query;
