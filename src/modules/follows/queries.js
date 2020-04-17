// Packages
const {GraphQLList} = require('graphql');

// Resolvers
const {getFollows} = require('./resolvers');

// Modules
const {UserType} = require('../users/types');

const follows = {
  type: GraphQLList(UserType),
  args: {},
  resolve: getFollows,
};

module.exports = {
  follows,
};
