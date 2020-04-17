// Packages
const {
  GraphQLBoolean,
  GraphQLInt
} = require('graphql');

// Modules
const {createFollow, removeFollow} = require('./resolvers');

const follow = {
  type: GraphQLBoolean,
  args: {
    userId: {
      name: 'user id',
      type: GraphQLInt,
    }
  },
  resolve: createFollow,
};

const unfollow = {
  type: GraphQLBoolean,
  args: {
    userId: {
      name: 'user id',
      type: GraphQLInt,
    }
  },
  resolve: removeFollow,
};

module.exports = {
  follow,
  unfollow
};
