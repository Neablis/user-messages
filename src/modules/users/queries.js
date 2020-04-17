// Packages
const {GraphQLList, GraphQLString} = require('graphql');

// Resolvers
const {getUser, getUsers, getLogin} = require('./resolvers');

// Modules
const {UserType} = require('./types');

const user = {
  type: UserType,
  args: {},
  resolve: getUser,
};

const users = {
  type: GraphQLList(UserType),
  args: {},
  resolve: getUsers,
};

const login = {
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
  resolve: getLogin,
};


module.exports = {
  user,
  users,
  login,
};
