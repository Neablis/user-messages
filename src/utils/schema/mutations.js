// Imports
const {GraphQLObjectType} = require('graphql');
// App Imports
const users = require('../../modules/users/mutations');

// Mutation
const mutation = new GraphQLObjectType({
  name: 'mutations',
  description: 'API Mutations [Create, Update, Delete]',

  fields: {
    ...users,
  },
});

module.exports = mutation;
