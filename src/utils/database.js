// Imports
const {Sequelize} = require('sequelize');

// Create new database connection
let connection;

if (process.env.NODE_ENV === 'test') {
  connection = new Sequelize(
    process.env.TEST_DATABASE_URL,
    {
      logging: false,
      operatorsAliases: Sequelize.Op,
      pool: {
        max: 20,
        min: 0,
        idle: 20000,
        acquire: 60000,
      },
      dialect: 'postgres',
    },
  );
} else {
  connection = new Sequelize(
    process.env.DATABASE_URL,
    {
      logging: false,
      operatorsAliases: Sequelize.Op,
      pool: {
        max: 20,
        min: 0,
        idle: 20000,
        acquire: 60000,
      },
      dialect: 'postgres',
    },
  );
}


connection
  .authenticate()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('ERROR - Unable to connect to the database:', err);
  });

module.exports = connection;
