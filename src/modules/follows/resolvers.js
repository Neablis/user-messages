const Follows = require('./service');
const Messages = require('../messages/service');

const createFollow = async (
  parentValue,
  {userId},
  {session},
) => {
  const loggedInUserId = session.userId;

  if (!loggedInUserId) {
    throw new Error('Must be logged in to get messages');
  }

  if (!userId) {
    throw new Error('Must pass a userId to follow');
  }

  if (loggedInUserId === userId) {
    throw new Error('You cant follow yourself');
  }

  const userFollows = new Follows(loggedInUserId);

  return !!await (userFollows.createFollow(userId));
};

const getFollows = async (
  parentValue,
  {},
  {session},
) => {
  const loggedInUserId = session.userId;

  if (!loggedInUserId) {
    throw new Error('Must be logged in to get messages');
  }

  const userFollows = new Follows(loggedInUserId);

  const allFollows = await userFollows.getFollows();

  return allFollows.map((follow) => follow.follow);
};

const removeFollow = async (
  parentValue,
  {userId},
  {session},
) => {
  const loggedInUserId = session.userId;

  if (!loggedInUserId) {
    throw new Error('Must be logged in to get messages');
  }

  const userFollows = new Follows(loggedInUserId);

  return !!(await userFollows.removeFollow(userId));
};

const getFollowedMessages = async (
  parentValue,
  {},
  {session},
) => {
  const loggedInUserId = session.userId;

  if (!loggedInUserId) {
    throw new Error('Must be logged in to get messages');
  }

  const userFollows = new Follows(loggedInUserId);

  const followedUsers = await userFollows.getFollows();

  const followedUserIds = followedUsers.map((follow) => follow.followId);

  const messages = new Messages(loggedInUserId);

  return messages.getFollowsMessages(followedUserIds);
};

module.exports = {
  getFollows,
  removeFollow,
  createFollow,
  getFollowedMessages,
};
