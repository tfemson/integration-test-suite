'use strict';

const expect = require('chai').expect;
const BbPromise = require('bluebird');
const execSync = require('child_process').execSync;
const AWS = require('aws-sdk');

const serverlessExec = require('../../../utils/index').serverlessExec;
const stackName = require('../../../utils/index').stackName;
const createTestService = require('../../../utils/index').createTestService;

const CF = new AWS.CloudFormation({ region: 'us-east-1' });
BbPromise.promisifyAll(CF, { suffix: 'Promised' });

describe('AWS - General: Deploy, invoke, remove lifecycle test', () => {
  before(() => {
    createTestService('aws-nodejs');
  });

  it('should deploy the service to AWS', function () {
    this.timeout(0);

    execSync(`${serverlessExec} deploy`, { stdio: 'inherit' });

    return CF.describeStacksPromised({ StackName: stackName })
      .then(d => expect(d.Stacks[0].StackStatus).to.be.equal('UPDATE_COMPLETE'));
  });

  it('should invoke function from AWS', function () {
    this.timeout(0);

    const invoked = execSync(`${serverlessExec} invoke --function hello --noGreeting true`);

    const result = JSON.parse(new Buffer(invoked, 'base64').toString());
    expect(result.message).to.be.equal('Go Serverless v1.0! Your function executed successfully!');
  });

  it('should remove the service from AWS', function () {
    this.timeout(0);

    execSync(`${serverlessExec} remove`, { stdio: 'inherit' });

    return CF.describeStacksPromised({ StackName: stackName })
      .then(d => expect(d.Stacks[0].StackStatus).to.be.equal('DELETE_COMPLETE'))
      .catch(e => {
        if (e.message.indexOf('does not exist') > -1) return BbPromise.resolve();
        throw new Error(e);
      });
  });
});
