// Packages
const bcrypt = require('bcrypt');

// Modules
// const redis = require('../../utils/redis');
const models = require('../../utils/models');

const getUserLogin = (user, session) => {
  session.userId = user.id;

  return user;
};

const getLogin = async (
  parentValue,
  {email=null, phoneNumber=null, password},
  {session},
) => {
  const lowerCaseEmail = email && email.toLowerCase();

  const user = await models.User.findOne({
    where: {
      email: lowerCaseEmail,
      phoneNumber,
    },
  });

  if (!user) {
    // User does not exists, throw error for missing password
    throw new Error('Incorrect Password');
  }

  const userDetails = user.get();

  // User exists
  const passwordMatch = await bcrypt.compare(
    password,
    userDetails.password,
  );

  if (!passwordMatch) {
    // Incorrect password
    throw new Error('Incorrect Password');
  }

  return await getUserLogin(user, session);
};

const createUser = async (
  parentValue,
  {email=null, phoneNumber=null, password},
  {session},
) => {
  const lowerCaseEmail = email && email.toLowerCase();

  const existingUser = await models.User.findOne({
    where: {
      email: lowerCaseEmail,
      phoneNumber,
    },
  });

  if (existingUser) {
    throw new Error('User already exists with that email');
  }

  if (!password || password.length < 5) {
    throw new Error('Your password must be longer than 4 characters.');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = await models.User.create({
    email: lowerCaseEmail,
    phoneNumber,
    password: hashedPassword,
  });

  return await getUserLogin(user, session);
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

  const user = await models.User.findByPk(userId);

  if (!user) {
    throw new Error('User could not be found');
  }

  return user;
};

const getUsers = async (
  parentValue,
  {},
  {},
) => {
  const users = await models.User.findAll();

  return users;
};

module.exports = {
  getLogin,
  getUser,
  getUsers,
  createUser,
};
