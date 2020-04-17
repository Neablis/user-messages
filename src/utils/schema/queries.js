const {GraphQLObjectType} = require('graphql');

const users = require('../../modules/users/queries');
const messages = require('../../modules/messages/queries');
const follows = require('../../modules/follows/queries');

// Query
const query = new GraphQLObjectType({
  name: 'query',
  description: 'API Queries [Read]',

  fields: () => ({
    ...users,
    ...messages,
    ...follows,
  }),
});

module.exports = query;
