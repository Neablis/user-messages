// Packages
const {GraphQLList} = require('graphql');

// Resolvers
const {getMessages} = require('./resolvers');

// Modules
const {MessageType} = require('./types');

const messages = {
  type: GraphQLList(MessageType),
  args: {},
  resolve: getMessages,
};

module.exports = {
  messages,
};
