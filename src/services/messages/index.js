const models = require('../../utils/models');

/**
 * Class for User Messages
 */
class Messages {
  /**
   * Must pass a userId on initiation
   * @param {string} userId
   */
  constructor(userId) {
    if (!userId) {
      throw new Error('Must be initialized with a userId');
    }

    this.userId = userId;
  }

  /**
   * Gets all messages for user
   * @return {Promise<any>}
   */
  async getMessages() {
    const messages = models.Message.findAll({
      where: {
        userId: this.userId,
      },
      order: [['createdAt', 'DESC']],
    });

    return messages;
  }

  /**
   * Gets follow users messages
   * @return {Promise<any>}
   */
  async getFollowsMessages(ids=[]) {
    const messages = models.Message.findAll({
      where: {
        userId: {
          [models.Sequelize.Op.in]: ids,
        },
      },
      order: [['createdAt', 'DESC']],
    });

    return messages;
  }

  /**
   * Creates a message for a user
   * @param {string} message
   * @return {Promise<*>}
   */
  async createMessage(message) {
    const messageModel = models.Message.create({
      userId: this.userId,
      message,
    });

    return messageModel;
  }

  /**
   * Updates a message with a new message
   * @param {string} message
   * @param {integer} messageId
   * @return {Promise<*>}
   */
  async updateMessage(message, messageId) {
    const messageModel = await models.Message.findOne({
      userId: this.userId,
      id: messageId,
    });

    if (!messageModel) {
      throw new Error('Could not find message');
    }

    return messageModel.update({
      message,
    });
  }
}

module.exports = Messages;
