const models = require('../../utils/models');

/**
 * Class for User Follows
 */
class Follows {
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
   * Follows another user
   * @param {integer} userId
   * @return {Promise<*>}
   */
  async createFollow(userId) {
    return models.Follow.findOrCreate({
      followId: userId,
      userId: this.userId,
    });
  }

  /**
   * Gets all messages for user
   * @return {Promise<any>}
   */
  async getFollows() {
    return models.Follow.findAll({
      where: {
        userId: this.userId,
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: models.User,
          as: 'follow',
        },
      ],
    });
  }

  /**
   * Un-follow another user
   * @param {integer} id
   * @return {Promise<*>}
   */
  async removeFollow(id) {
    const follow = await models.Follow.findOne({
      where: {
        followId: id,
      },
    });

    if (!follow) {
      throw new Error('Could not find user to unfollow');
    }

    return follow.destroy();
  }
}

module.exports = Follows;
