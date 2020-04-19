const connection = require('../../src/utils/database');
const models = require('../../src/utils/models');

const truncateAndCascade = (modelName) =>
  models[modelName].destroy({
    where: {},
    force: true,
    // Delete relationships.
    cascade: true,
    // Restart ID columns from 0.
    restartIdentity: true,
    hooks: true,
  });

module.exports = async (model) => {
  if (model) {
    return truncateAndCascade(model);
  }

  // For truncating multiple tables.
  return new Promise(async (accept, reject) => {
    // Sync defined models with the DB.
    await connection.sync({force: true});
    // Then, iterate through all of the tables and truncate them.
    await Promise.all(
      Object.keys(models).map((key) => {
        if (['sequelize', 'Sequelize'].includes(key)) return null;
        return truncateAndCascade(key);
      }),
    );
    // Finally, accept the promise.
    accept();
  });
};
