const {GraphQLObjectType} = require('graphql');

const users = require('../../modules/users/queries');

// Query
const query = new GraphQLObjectType({
  name: 'query',
  description: 'API Queries [Read]',

  fields: () => ({
    ...users,
  }),
});

module.exports = query;
