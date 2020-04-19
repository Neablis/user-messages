const models = require('../../src/utils/models');

const {ApolloServer} = require('apollo-server-express');
const {createTestClient} = require('apollo-server-integration-testing');
const redis = require('ioredis');

const chai = require('../setup/chai');
const expect = chai.expect;

const schema = require('../../src/utils/schema');
const truncate = require('../setup/truncate');

describe('Follows', () => {
  let query = null;
  let mutate = null;
  let client = null;

  const FOLLOW = `
    mutation follow($userId: Int!) {
      follow(userId: $userId)
    }
  `;

  const UNFOLLOW = `
    mutation unfollow($userId: Int!) {
      unfollow(userId: $userId)
    }
  `;

  const FOLLOWS = `
    query follows {
      follows {
        id,
        email
        phoneNumber
      }
    }
  `;

  const FOLLOWED_MESSAGES = `
    query followedMessages {
      followedMessages {
        id
        message
      }
    }
  `;

  const CREATE_MESSAGE = `
    mutation message($message: String, $id: Int) {
      message(message: $message, id: $id) {
        id
        message
      }
    }
  `;

  const CREATE_USER = `
    mutation user($email: String, $phoneNumber: String, $password: String!) {
      user(email: $email, phoneNumber: $phoneNumber, password: $password) {
        id
        email
        phoneNumber
      }
    }
  `;

  const userLogin = {
    email: 'test@dharma.io',
    password: '12345',
  };

  beforeEach(async () => {
    await truncate();

    const context = () => ({
      session: {
        userId: 1,
      },
    });

    const apolloServer = new ApolloServer({schema, context});
    const testClient = createTestClient({
      apolloServer,
    });

    query = testClient.query;
    mutate = testClient.mutate;

    client = new redis(process.env.REDIS_URL);
    await client.flushdb();

    return mutate(CREATE_USER, {
      variables: userLogin,
    });
  });

  describe('#queries', () => {
    describe('#follows', () => {
      it('returns all followed users', async () => {
        const followUser = await mutate(CREATE_USER, {
          variables: {
            phoneNumber: '111',
            password: '12345',
          },
        });

        await query(FOLLOW, {
          variables: {
            userId: followUser.data.user.id,
          },
        });

        const followedUsers = await query(FOLLOWS, {
          variables: {},
        });

        expect(followedUsers.data.follows).to.have.length(1);
      });
    });

    describe('#getFollowedMessages', () => {
      it('Returns all messages of followed user', async () => {
        // Creates a new user
        const followUser = await mutate(CREATE_USER, {
          variables: {
            phoneNumber: '111',
            password: '12345',
          },
        });

        // User 1 follows new user
        await query(FOLLOW, {
          variables: {
            userId: followUser.data.user.id,
          },
        });

        const context = () => ({
          session: {
            userId: followUser.data.user.id,
          },
        });

        const apolloServer = new ApolloServer({schema, context});

        const followedUserClient = createTestClient({
          apolloServer,
        });

        // User 2 creates a message
        await followedUserClient.mutate(CREATE_MESSAGE, {
          variables: {
            message: '1',
          },
        });

        const followedMessages = await mutate(FOLLOWED_MESSAGES, {
          variables: {
            phoneNumber: '111',
            password: '12345',
          },
        });

        expect(followedMessages.data.followedMessages).to.have.length(1);
      });
    });
  });

  describe('#mutation', () => {
    describe('#follow', () => {
      it('follows another user', async () => {
        // Create a new user
        const followUser = await mutate(CREATE_USER, {
          variables: {
            phoneNumber: '111',
            password: '12345',
          },
        });

        // Follow that new user
        const results = await query(FOLLOW, {
          variables: {
            userId: followUser.data.user.id,
          },
        });

        expect(results.data.follow);
      });

      it('cant follow themself', async () => {
        const results = await query(FOLLOW, {
          variables: {
            userId: 1,
          },
        });

        expect(results.errors).to.exist;
        expect(results.errors[0].message).to.eql('You cant follow yourself');
      });
    });

    describe('#unfollow', () => {
      it('unfollows a followed user', async () => {
        // Creates a new user
        const followUser = await mutate(CREATE_USER, {
          variables: {
            phoneNumber: '111',
            password: '12345',
          },
        });

        // Original user follows new users
        await query(FOLLOW, {
          variables: {
            userId: followUser.data.user.id,
          },
        });

        // Get followed users
        let followedUsers = await query(FOLLOWS, {
          variables: {},
        });

        expect(followedUsers.data.follows).to.have.length(1);

        await query(UNFOLLOW, {
          variables: {
            userId: followedUsers.data.follows[0].id,
          },
        });

        followedUsers = await query(FOLLOWS, {
          variables: {},
        });

        expect(followedUsers.data.follows).to.have.length(0);
      });
    });
  });
});

