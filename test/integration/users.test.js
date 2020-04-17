const {ApolloServer} = require('apollo-server-express');
const {createTestClient} = require('apollo-server-integration-testing');
const redis = require('ioredis');

const chai = require('../setup/chai');
const expect = chai.expect;

const schema = require('../../src/utils/schema');

describe('JobProcessor', () => {
  let query = null;
  let mutate = null;
  let client = null;

  const JOB = `
    query job($id: Int!) {
      job(id: $id) {
        id
        progress
        result
        status
      }
    }
  `;

  const JOBS = `
    query jobs {
      jobs {
        id
        progress
        result
        status
      }
    }
  `;

  const CREATE_JOB = `
    mutation job($url: String!) {
      job(url: $url) {
        id
        progress
        result
        status
      }
    }
  `;

  beforeEach(async () => {
    const context = ({req}) => ({
      req,
    });

    const apolloServer = new ApolloServer({schema, context});

    const testClient = createTestClient({
      apolloServer,
    });

    query = testClient.query;
    mutate = testClient.mutate;

    client = new redis(process.env.REDIS_URL);
    return client.flushdb();
  });

  describe('#queries', () => {
    describe('#job', () => {
      it('returns a job', async () => {
        const createdJob = await mutate(CREATE_JOB, {
          variables: {url: 'http://numbersapi.com/44'},
        });

        const foundJob = await query(JOB, {
          variables: {id: createdJob.data.job.id},
        });

        expect(createdJob.data).to.eql(foundJob.data);
      });
    });

    describe('#jobs', () => {
      it('returns all jobs', async () => {
        await mutate(CREATE_JOB, {
          variables: {url: 'http://numbersapi.com/44'},
        });

        const foundJobs = await query(JOBS);

        expect(foundJobs.data.jobs.length).eql(1);
      });
    });
  });

  describe('#mutations', () => {
    describe('#job', () => {
      it('throws an error if invalid url', async () => {
        const createdJob = await mutate(CREATE_JOB, {
          variables: {url: 'broken'},
        });

        expect(createdJob.errors).to.exist;
      });

      it('creates a job', async () => {
        const createdJob = await mutate(CREATE_JOB, {
          variables: {url: 'http://numbersapi.com/44'},
        });

        expect(createdJob).to.not.eql(null);
      });

      it('returns same job if same url in 60m', async () => {
        const createdJob1 = await mutate(CREATE_JOB, {
          variables: {url: 'http://numbersapi.com/44'},
        });

        const createdJob2 = await mutate(CREATE_JOB, {
          variables: {url: 'http://numbersapi.com/44'},
        });

        expect(createdJob1).to.eql(createdJob2);
      });

      it('creates a new job if not duplicate url', async () => {
        const createdJob1 = await mutate(CREATE_JOB, {
          variables: {url: 'http://numbersapi.com/44'},
        });

        const createdJob2 = await mutate(CREATE_JOB, {
          variables: {url: 'http://numbersapi.com/45'},
        });

        expect(createdJob1).to.not.eql(createdJob2);
      });
    });
  });
});

