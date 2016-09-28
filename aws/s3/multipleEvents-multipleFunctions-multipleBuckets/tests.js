'use strict';

const path = require('path');
const expect = require('chai').expect;
const Utils = require('../../../utils/index');


describe('AWS - S3: multiple events in a single function with multiple buckets', function () {
  this.timeout(0);

  before(() => {
    Utils.createTestService('aws-nodejs', path.join(__dirname, 'test-service'));
    Utils.setupBucketNames();
    Utils.deployService();
  });

  it('should trigger functions when object created or deleted in buckets', () => Utils
    .createAndRemoveInBucket('serverless-integration-test-suite-s3-1')
    .then(() => Utils.createAndRemoveInBucket('serverless-integration-test-suite-s3-2'))
    .delay(60000)
    .then(() => {
      const helloLogs = Utils.getFunctionLogs('hello');
      const worldLogs = Utils.getFunctionLogs('world');

      expect(/aws:s3/g.test(helloLogs)).to.equal(true);
      expect(/ObjectCreated:Put/g.test(helloLogs)).to.equal(true);
      expect(/ObjectRemoved:Delete/g.test(helloLogs)).to.equal(true);

      expect(/aws:s3/g.test(worldLogs)).to.equal(true);
      expect(/ObjectCreated:Put/g.test(worldLogs)).to.equal(true);
      expect(/ObjectRemoved:Delete/g.test(worldLogs)).to.equal(true);
    })
  );

  after(() => {
    Utils.removeService();
  });
});
