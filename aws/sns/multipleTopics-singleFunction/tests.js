'use strict';

const path = require('path');
const expect = require('chai').expect;
const Utils = require('../../../utils/index');

describe('AWS - SNS: multiple topics single function', function () {
  this.timeout(0);

  before(() => {
    Utils.createTestService('aws-nodejs', path.join(__dirname, 'test-service'));
    Utils.deployService();
  });

  it('should trigger function when new message is published', () => Utils
    .publishSnsMessage('serverless-integration-test-suite-sns-1', 'topic1')
    .then(() => Utils.publishSnsMessage('serverless-integration-test-suite-sns-2', 'topic2'))
    .delay(60000)
    .then(() => {
      const logs = Utils.getFunctionLogs('hello');
      expect(/aws:sns/g.test(logs)).to.equal(true);
      expect(/topic1/g.test(logs)).to.equal(true);
      expect(/topic2/g.test(logs)).to.equal(true);
    })
  );

  after(() => {
    Utils.removeService();
  });
});
