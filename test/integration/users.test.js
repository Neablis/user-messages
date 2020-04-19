const {ApolloServer} = require('apollo-server-express');
const {createTestClient} = require('apollo-server-integration-testing');
const redis = require('ioredis');

const chai = require('../setup/chai');
const expect = chai.expect;

const schema = require('../../src/utils/schema');
const truncate = require('../setup/truncate');

describe('User', () => {
  let query = null;
  let mutate = null;
  let client = null;

  const USER = `
    query user {
      user {
        id
        email
        phoneNumber
      }
    }
  `;

  const LOGIN = `
    query login($email: String, $phoneNumber: String, $password: String!) {
      login(email: $email, phoneNumber: $phoneNumber, password: $password) {
        id
        email
        phoneNumber
      }
    }
  `;

  const USERS = `
    query users {
      users {
        id
        email
        phoneNumber
      }
    }
  `;

  const SEARCH = `
    query search($email: String, $phoneNumber: String) {
      search(email: $email, phoneNumber: $phoneNumber) {
        id
        email
        phoneNumber
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

  before(async () => {
    const context = ({req}) => ({
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

    await mutate(CREATE_USER, {
      variables: userLogin,
    });
  });

  beforeEach(async () => {
    client = new redis(process.env.REDIS_URL);
    await client.flushdb();

    return truncate();
  });

  describe('#queries', () => {
    describe('#users', () => {
      it('return logged in user', async () => {
        await mutate(CREATE_USER, {
          variables: userLogin,
        });

        const results = await query(USER, {
          variables: {},
        });

        const {
          data: {
            user,
          },
        } = results;

        expect(user).to.exist;
        expect(user.email).to.eql(userLogin.email);
      });
    });

    describe('#users', () => {
      it('returns all users', async () => {
        await mutate(CREATE_USER, {
          variables: userLogin,
        });

        const results = await query(USERS, {
          variables: {},
        });

        const {
          data: {
            users,
          },
        } = results;

        expect(users).to.have.length(1);
      });
    });

    describe('#login', () => {
      it('throws an error if password is wrong', async () => {
        await mutate(CREATE_USER, {
          variables: userLogin,
        });

        const results = await query(LOGIN, {
          variables: {
            email: 'test@dharma.io',
            password: 'wrong',
          },
        });

        expect(results.errors).to.exist;
        expect(results.errors[0].message).to.eql('Incorrect Password');

        expect(results.data.login).to.be.null;
      });

      it('return user if password is successful', async () => {
        await mutate(CREATE_USER, {
          variables: userLogin,
        });

        const results = await query(LOGIN, {
          variables: userLogin,
        });

        const {
          data: {
            login,
          },
        } = results;

        expect(login.email).to.eql(userLogin.email);
      });
    });

    describe('#search', () => {
      it('return a user if a field matches', async () => {
        await mutate(CREATE_USER, {
          variables: userLogin,
        });

        const results = await query(SEARCH, {
          variables: {
            email: "test"
          },
        });

        const {
          data: {
            search,
          },
        } = results;

        expect(search).to.have.length(1);
        expect(search[0].email).to.eql(userLogin.email);
      });
    });
  });

  describe('#mutation', () => {
    describe('#user', () => {
      it('creates a new user', async () => {
        const results = await mutate(CREATE_USER, {
          variables: userLogin,
        });

        const {
          data: {
            user,
          },
        } = results;

        expect(user.email).to.eql(userLogin.email);
      });

      it('creates a new user using a phone number', async () => {
        const results = await mutate(CREATE_USER, {
          variables: {
            phoneNumber: '1111',
            password: '12345',
          },
        });

        const {
          data: {
            user,
          },
        } = results;

        expect(user.email).to.be.null;
        expect(user.phoneNumber).to.eql('1111');
      });
    });
  });
});

