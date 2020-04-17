'use strict';

// User
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('messages', {
    message: {
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
