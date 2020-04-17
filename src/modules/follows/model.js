'use strict';

// User
module.exports = (sequelize, DataTypes) => {
  const follow = sequelize.define('follows', {
  });

  follow.associate = function(models) {
    follow.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });

    follow.belongsTo(models.User, {
      as: 'follow',
      foreignKey: 'followId',
    });
  };

  return follow;
};
