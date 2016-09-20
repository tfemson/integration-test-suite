'use strict';

const path = require('path');
const expect = require('chai').expect;
const Utils = require('../../../utils/index');

describe('AWS - S3: multiple events in multiple functions with single bucket', function () {
  this.timeout(0);

  before(() => {
    Utils.createTestService('aws-nodejs', path.join(__dirname, 'test-service'));
    Utils.deployService();
  });

  it('should trigger create/remove functions on object create/remove', () => Utils
    .createAndRemoveInBucket('serverless-integration-test-suite-s3')
    .delay(60000)
    .then(() => {
      const createLogs = Utils.getFunctionLogs('create');
      const removeLogs = Utils.getFunctionLogs('remove');

      expect(/aws:s3/g.test(createLogs)).to.equal(true);
      expect(/aws:s3/g.test(removeLogs)).to.equal(true);
      expect(/ObjectCreated:Put/g.test(createLogs)).to.equal(true);
      expect(/ObjectRemoved:Delete/g.test(removeLogs)).to.equal(true);
    })
  );

  after(() => {
    Utils.removeService();
  });
});
