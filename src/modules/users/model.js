'use strict';

// User
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    email: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  });

  return User;
};
