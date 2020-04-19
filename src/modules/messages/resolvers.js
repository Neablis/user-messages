// Modules
const Messages = require('./service');

const getMessages = async (
  parentValue,
  {},
  {session},
) => {
  const userId = session.userId;

  if (!userId) {
    throw new Error('Must be logged in to get messages');
  }

  const userMessages = new Messages(userId);

  return userMessages.getMessages();
};

const createMessage = async (
  parentValue,
  {message, id},
  {session},
) => {
  const userId = session.userId;

  if (!userId) {
    throw new Error('Must be logged in to create a message');
  }

  if (!message) {
    throw new Error('Must pass a message');
  }

  const userMessages = new Messages(userId);

  if (id) {
    return userMessages.updateMessage(message, id);
  } else {
    return userMessages.createMessage(message);
  }
};

module.exports = {
  getMessages,
  createMessage,
};
