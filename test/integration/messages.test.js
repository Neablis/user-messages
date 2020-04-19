const models = require('../../src/utils/models');

const {ApolloServer} = require('apollo-server-express');
const {createTestClient} = require('apollo-server-integration-testing');
const redis = require('ioredis');

const chai = require('../setup/chai');
const expect = chai.expect;

const schema = require('../../src/utils/schema');
const truncate = require('../setup/truncate');

describe('Messages', () => {
  let query = null;
  let mutate = null;
  let client = null;

  const MESSAGES = `
    query messages {
      messages {
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

  const CREATE_MESSAGE = `
    mutation message($message: String, $id: Int) {
      message(message: $message, id: $id) {
        id
        message
      }
    }
  `;

  const userLogin = {
    email: 'test@dharma.io',
    password: '12345',
  };

  beforeEach(async () => {
    await truncate();

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

    client = new redis(process.env.REDIS_URL);
    await client.flushdb();

    return mutate(CREATE_USER, {
      variables: userLogin,
    });
  });

  describe('#queries', () => {
    describe('#messsages', () => {
      it('returns all messages', async () => {
        await query(CREATE_MESSAGE, {
          variables: {
            message: 'Hello',
          },
        });

        const {data} = await query(MESSAGES, {
          variables: {},
        });

        expect(data.messages).to.have.length(1);
        expect(data.messages[0].message).to.eql('Hello');
      });
    });
  });

  describe('#mutation', () => {
    describe('#message', () => {
      it('creates a message', async () => {
        let results = await query(CREATE_MESSAGE, {
          variables: {
            message: 'Hello',
          },
        });

        const {
          data: {
            message,
          },
        } = results;

        expect(message.message).to.eql('Hello');
      });

      it('updates a message', async () => {
        const results = await query(CREATE_MESSAGE, {
          variables: {
            message: 'Hello',
          },
        });

        const {
          data: {
            message,
          },
        } = results;

        expect(message.message).to.eql('Hello');

        const updatedResult = await query(CREATE_MESSAGE, {
          variables: {
            message: 'World',
            id: message.id,
          },
        });

        expect(updatedResult.data.message.message).to.eql('World');
        expect(updatedResult.data.message.id).to.eql(message.id);
      });
    });
  });
});

