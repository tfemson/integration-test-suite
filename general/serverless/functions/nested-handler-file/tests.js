'use strict';

const path = require('path');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;

const Utils = require('../../../../utils/index');

describe('General - Serverless: Nested handler file', () => {
  before(function () {
    this.timeout(0);

    Utils.createTestService('aws-nodejs', path.join(__dirname, 'test-service'));
    Utils.deployService();
  });

  it('should invoke the nested handler function from AWS', function () {
    this.timeout(0);

    const invoked = execSync(`${Utils.serverlessExec} invoke --function hello --noGreeting true`);

    const result = JSON.parse(new Buffer(invoked, 'base64').toString());
    expect(result.message).to.be.equal('Go Serverless v1.0! Your function executed successfully!');
  });

  after(function () {
    this.timeout(0);

    Utils.removeService();
  });
});
