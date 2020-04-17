/**
 * Job Processor abstract class for creating a new job
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
}

module.exports = Messages;
