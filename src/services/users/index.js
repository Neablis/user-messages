const models = require('../../utils/models');
const bcrypt = require('bcrypt');
const {Op} = require('sequelize');

/**
 * Class for User Messages
 */
class Users {
  /**
   * Must pass a userId on initiation
   * @param {string} userId
   * @constructor
   */
  constructor(userId) {
    if (!userId) {
      throw new Error('Must be initialized with a userId');
    }

    this.userId = userId;
  }

  /**
   * Paginated query for all users
   * @param limit
   * @param offset
   * @returns {Promise<<Model<T, T2>[]>>}
   * @static
   */
  static async getUsers(limit=100, offset=0) {
    return models.User.findAll({
      limit,
      offset,
    });
  }

  /**
   * Creates a new user
   * @param {string} email
   * @param {string} phoneNumber
   * @param {string} password
   * @return {Promise<Users>}
   */
  static async create(email, phoneNumber, password) {
    const lowerCaseEmail = email && email.toLowerCase();

    const existingUser = await models.User.findOne({
      where: {
        email: {
          [Op.eq]: lowerCaseEmail,
        },
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

    return new this(user.id);
  }

  /**
   * Gets a user if the password match
   * @param {string} email
   * @param {string} phoneNumber
   * @param {string} password
   * @static
   * @return {Promise<Users>}
   */
  static async login(email, phoneNumber, password) {
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

    // User exists
    const passwordMatch = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      // Incorrect password
      throw new Error('Incorrect Password');
    }

    return new this(user.id);
  }

  /**
   * Search the users
   * @param {string} email
   * @param {string} phoneNumber
   * @return {Promise<any>}
   */
  async searchUsers(email, phoneNumber) {
    const userModels = await models.User.findAll({
      limit: 10,
      where: {
        [models.Sequelize.Op.or]: [
          {
            email: {
              [models.Sequelize.Op.iLike]: `%${email}%`,
            },
          },
          {
            phoneNumber: {
              [models.Sequelize.Op.iLike]: `%${phoneNumber}%`,
            },
          },
        ],
      },
    });

    return userModels;
  }

  /**
   * Returns the model representing the user
   * @return {Promise<<Model<T, T2> | null>>}
   */
  async get() {
    return models.User.findByPk(this.userId);
  }
}

module.exports = Users;
