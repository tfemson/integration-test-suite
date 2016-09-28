'use strict';

const path = require('path');
const expect = require('chai').expect;
const Utils = require('../../../utils/index');

describe('AWS - S3: multiple events in a single function with a single bucket', function () {
  this.timeout(0);

  before(() => {
    Utils.createTestService('aws-nodejs', path.join(__dirname, 'test-service'));
    Utils.setupBucketNames();
    Utils.deployService();
  });

  it('should trigger function when object created or deleted in bucket', () => Utils
    .createAndRemoveInBucket('serverless-integration-test-suite-s3')
    .delay(60000)
    .then(() => {
      const logs = Utils.getFunctionLogs('hello');

      expect(/aws:s3/g.test(logs)).to.equal(true);
      expect(/ObjectCreated:Put/g.test(logs)).to.equal(true);
      expect(/ObjectRemoved:Delete/g.test(logs)).to.equal(true);
    })
  );

  after(() => {
    Utils.removeService();
  });
});
