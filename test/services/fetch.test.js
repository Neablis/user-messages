/* eslint-disable */
const sinon = require('sinon');
const axios = require('axios');
const redis = require('ioredis');

const chai = require('../setup/chai');
const expect = chai.expect;

const Fetch = require('../../src/services/job-processor/jobs/fetch');

describe('Messages', () => {
  let client = null;
  let sandbox = null;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    client = new redis(process.env.REDIS_URL);
    return client.flushdb();
  });

  afterEach(async () => {
    sandbox = sandbox.restore();
  });

  describe('#processJob', () => {
    let fakeJob = null;

    beforeEach(() => {
      fakeJob = {
        progress: sinon.spy(),
        data: {
          url: "https://www.test.com/"
        }
      }
    });

    it('takes a job and error if no url', async () => {
      const fakeCallback = sinon.spy();

      fakeJob.data.url = null;

      await Fetch.processJob(fakeJob, fakeCallback);

      expect(fakeCallback.firstCall.firstArg).to.eql('Missing a url');
      expect(fakeJob.progress.calledOnce).to.be.true;
    });

    it('takes a job and processes it', async () => {
      const fakeCallback = sinon.spy();
      sandbox.stub(axios, "get").returns(Promise.resolve({status:200, data: 'test'}));

      await Fetch.processJob(fakeJob, fakeCallback);

      expect(fakeJob.progress.calledTwice).to.be.true;
      expect(fakeCallback.firstCall.firstArg).to.be.null;
      expect(fakeCallback.firstCall.lastArg).to.eql('test');
    });

    it('gracefull fails if it throws', async () => {
      const fakeCallback = sinon.spy();
      sandbox.stub(axios, "get").returns(Promise.reject('error'));


      await Fetch.processJob(fakeJob, fakeCallback);

      expect(fakeJob.progress.calledOnce).to.be.true;
      expect(fakeCallback.firstCall.firstArg).to.eql('error');
    });
  });
});
