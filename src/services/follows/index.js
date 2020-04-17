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
    const follow = models.Follow.create({
      followId: userId,
      userId: this.userId,
    });

    return follow;
  }

  /**
   * Gets all messages for user
   * @return {Promise<any>}
   */
  async getFollows() {
    const follows = models.Follow.findAll({
      where: {
        userId: this.userId,
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: models.User,
          as: 'user',
        },
      ],
    });

    return follows;
  }

  /**
   * Un-follow another user
   * @param {integer} id
   * @return {Promise<*>}
   */
  async removeFollow(id) {
    const follow = await models.Follow.findByPk(id);


    if (!follow) {
      throw new Error('Could not find user to unfollow');
    }

    return follow.destroy();
  }
}

module.exports = Follows;
