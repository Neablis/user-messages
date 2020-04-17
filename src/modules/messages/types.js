// Imports
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const MessageType = new GraphQLObjectType({
  name: 'Message',
  description: 'Message Type',

  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    message: {
      type: GraphQLString,
    },
    createdAt: {
      type: GraphQLString,
    },
  }),
});

module.exports = {MessageType};
