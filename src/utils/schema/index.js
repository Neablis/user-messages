// Imports
const {GraphQLSchema} = require('graphql');

// App Imports
const query = require('./queries');
const mutation = require('./mutations');
const types = require('./types');

// Schema
const schema = new GraphQLSchema({
  types,
  query,
  mutation,
});

module.exports = schema;
