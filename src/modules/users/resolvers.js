// Packages
const Users = require('./service');

// Modules
// const redis = require('../../utils/redis');
const models = require('../../utils/models');

const getUserLogin = async (user, session) => {
  const model = await user.get();

  session.userId = model.id;

  return model;
};

const getLogin = async (
  parentValue,
  {email=null, phoneNumber=null, password},
  {session},
) => {
  const user = await Users.login(email, phoneNumber, password);

  return getUserLogin(user, session);
};

const createUser = async (
  parentValue,
  {email=null, phoneNumber=null, password},
  {session},
) => {
  const user = await Users.create(email, phoneNumber, password);

  return getUserLogin(user, session);
};

const getUser = async (
  parentValue,
  {},
  {session},
) => {
  const userId = session.userId;

  if (!userId) {
    throw new Error('Must be logged in to get user');
  }

  const user = new Users(userId);

  return user.get();
};

const getUsers = async (
  parentValue,
  {limit, offset},
  {},
) => {
  return Users.getUsers(limit, offset);
};

const searchUsers = async (
  parentValue,
  {email, phoneNumber},
  {session},
) => {
  const userId = session.userId;

  if (!userId) {
    throw new Error('User must be logged in');
  }

  const user = new Users(userId);

  return user.searchUsers(email, phoneNumber);
};

module.exports = {
  getLogin,
  getUser,
  getUsers,
  searchUsers,
  createUser,
};
