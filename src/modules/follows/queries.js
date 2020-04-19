// Packages
const {getFollowedMessages} = require('./resolvers');
const {MessageType} = require('../messages/types');

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

const followedMessages = {
  type: GraphQLList(MessageType),
  args: {},
  resolve: getFollowedMessages,
};

module.exports = {
  follows,
  followedMessages,
};
