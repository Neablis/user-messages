'use strict';

// User
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('messages', {
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

  Message.associate = function(models) {
    Message.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });
  };

  return Message;
};
