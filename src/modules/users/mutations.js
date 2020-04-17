// Packages
const {GraphQLString} = require('graphql');

// Modules
const {createUser} = require('./resolvers');
const {UserType} = require('./types');

const user = {
  type: UserType,
  args: {
    email: {
      name: 'email',
      type: GraphQLString,
    },
    password: {
      name: 'password',
      type: GraphQLString,
    },
    phoneNumber: {
      name: 'phone number',
      type: GraphQLString,
    },
  },
  resolve: createUser,
};

module.exports = {
  user,
};
