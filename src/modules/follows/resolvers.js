const Follows = require('../../services/follows');

const createFollow = async (
  parentValue,
  {userId},
  {session},
) => {
  const loggedInUserId = session.userId;

  if (!loggedInUserId) {
    throw new Error('Must be logged in to get messages');
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

  return allFollows.map((follow) => follow.user);
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

  const followedUserIds = followedUsers.map((follow) => follow.userId);

  const messages = new Messages(loggedInUserId);

  return messages.getFollowsMessages(followedUserIds);
};

module.exports = {
  getFollows,
  removeFollow,
  createFollow,
  getFollowedMessages,
};
