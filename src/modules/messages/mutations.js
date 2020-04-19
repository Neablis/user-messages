// Packages
const {
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql');

// Modules
const {createMessage, deleteMessageResolver} = require('./resolvers');
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
    },
  },
  resolve: createMessage,
};

const deleteMessage = {
  type: GraphQLBoolean,
  args: {
    id: {
      name: 'id',
      type: GraphQLInt,
    },
  },
  resolve: deleteMessageResolver,
};

module.exports = {
  message,
  deleteMessage,
};
