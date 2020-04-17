// Imports
const {GraphQLObjectType} = require('graphql');
// App Imports
const users = require('../../modules/users/mutations');
const messages = require('../../modules/messages/mutations');
const follows = require('../../modules/follows/mutations');

// Mutation
const mutation = new GraphQLObjectType({
  name: 'mutations',
  description: 'API Mutations [Create, Update, Delete]',

  fields: {
    ...users,
    ...messages,
    ...follows
  },
});

module.exports = mutation;
