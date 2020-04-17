// Imports
const Sequelize = require('sequelize');
// App Imports
const databaseConnection = require('./database');

const models = {
  User: databaseConnection.import('../modules/users/model'),
  Message: databaseConnection.import('../modules/messages/model'),
  Follow: databaseConnection.import('../modules/follows/model'),
};

// A generic function that takes in a model and props, which allows
// one to upsert on that model.
const findOrCreate = async (model, props) => {
  const existing = await model.findOne({
    where: props,
  });

  if (existing) {
    return existing;
  }

  return model.create(props);
};

Object.keys(models).forEach((modelName) => {
  const model = models[modelName];
  if (model.associate) {
    model.associate(models);
  }

  // Extend the model by adding a new function that takes in props
  model.findOrCreate = (props) => {
    // And that function calls the generic `findOrCreateBy` function with itself
    // and the props given.
    return findOrCreate(model, props);
  };
});

models.sequelize = databaseConnection;
models.Sequelize = Sequelize;

module.exports = models;
