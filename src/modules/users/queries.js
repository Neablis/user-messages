// Packages
const {GraphQLList, GraphQLString, GraphQLInt} = require('graphql');

// Resolvers
const {getUser, getUsers, getLogin, searchUsers} = require('./resolvers');

// Modules
const {UserType} = require('./types');

const user = {
  type: UserType,
  args: {},
  resolve: getUser,
};

const users = {
  type: GraphQLList(UserType),
  args: {
    limit: {
      name: 'limit',
      type: GraphQLInt,
    },
    offset: {
      name: 'offset',
      type: GraphQLInt,
    },
  },
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

const search = {
  type: GraphQLList(UserType),
  args: {
    email: {
      name: 'email',
      type: GraphQLString,
    },
    phoneNumber: {
      name: 'phone number',
      type: GraphQLString,
    },
  },
  resolve: searchUsers,
};


module.exports = {
  user,
  users,
  login,
  search,
};
