'use strict';

const path = require('path');
const expect = require('chai').expect;
const BbPromise = require('bluebird');
const execSync = require('child_process').execSync;
const AWS = require('aws-sdk');
const _ = require('lodash');
const fetch = require('node-fetch');

const serverlessExec = require('../../../utils/index').serverlessExec;
const createTestService = require('../../../utils/index').createTestService;

const CF = new AWS.CloudFormation({ region: 'us-east-1' });
BbPromise.promisifyAll(CF, { suffix: 'Promised' });

describe('AWS - API Gateway: Object endpoint setup test', () => {
  let stackName;

  before(() => {
    stackName = createTestService('aws-nodejs', [
      path.join(__dirname, 'serverless.yml'),
      path.join(__dirname, 'handler.js'),
    ]);
  });

  it('should deploy the service to AWS', function () {
    this.timeout(0);

    execSync(`${serverlessExec} deploy`, { stdio: 'inherit' });

    return CF.describeStacksPromised({ StackName: stackName })
      .then(d => expect(d.Stacks[0].StackStatus).to.be.equal('UPDATE_COMPLETE'));
  });

  it('should expose an accessible HTTP endpoint', function () {
    this.timeout(0);

    return CF.describeStacksPromised({ StackName: stackName })
      .then((result) => _.find(result.Stacks[0].Outputs,
        { OutputKey: 'ServiceEndpoint' }).OutputValue)
      .then((endpointOutput) => {
        let endpoint = endpointOutput.match(/https:\/\/.+\.execute-api\..+\.amazonaws\.com.+/)[0];
        endpoint = `${endpoint}/hello`;

        return fetch(endpoint)
          .then(response => response.json())
          .then((json) => {
            expect(json.message).to.equal('Hello from API Gateway!');
          });
      });
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
