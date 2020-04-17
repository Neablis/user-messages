// Imports
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'User Type',

  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    email: {
      type: GraphQLString,
    },
    phoneNumber: {
      type: GraphQLString,
    },
  }),
});

module.exports = {UserType};
