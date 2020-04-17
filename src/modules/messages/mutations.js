// Packages
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

// Modules
const {createMessage} = require('./resolvers');
const {MessageType} = require('./types');

const message = {
  type: MessageType,
  args: {
    message: {
      name: 'message',
      type: GraphQLString,
    },
    id: {
      name: 'id',
      type: GraphQLInt,
    }
  },
  resolve: createMessage,
};

module.exports = {
  message,
};
