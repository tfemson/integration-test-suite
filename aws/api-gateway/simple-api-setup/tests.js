'use strict';

const path = require('path');
const expect = require('chai').expect;
const BbPromise = require('bluebird');
const AWS = require('aws-sdk');
const _ = require('lodash');
const fetch = require('node-fetch');

const Utils = require('../../../utils/index');

const CF = new AWS.CloudFormation({ region: 'us-east-1' });
BbPromise.promisifyAll(CF, { suffix: 'Promised' });

describe('AWS - API Gateway: Simple API setup test', () => {
  let stackName;
  let endpoint;

  before(function () {
    this.timeout(0);

    stackName = Utils.createTestService('aws-nodejs', path.join(__dirname, 'test-service'));
    Utils.deployService();
  });

  it('should expose the endpoint(s) in the CloudFormation Outputs', function () {
    this.timeout(0);

    return CF.describeStacksPromised({ StackName: stackName })
      .then((result) => _.find(result.Stacks[0].Outputs,
        { OutputKey: 'ServiceEndpoint' }).OutputValue)
      .then((endpointOutput) => {
        endpoint = endpointOutput.match(/https:\/\/.+\.execute-api\..+\.amazonaws\.com.+/)[0];
        endpoint = `${endpoint}/hello`;
      });
  });

  it('should expose an accessible POST HTTP endpoint', function () {
    this.timeout(0);

    return fetch(endpoint, { method: 'POST' })
      .then(response => response.json())
      .then((json) => expect(json.message).to.equal('Hello from API Gateway!'));
  });

  it('should expose an accessible GET HTTP endpoint', function () {
    this.timeout(0);

    return fetch(endpoint)
      .then(response => response.json())
      .then((json) => expect(json.message).to.equal('Hello from API Gateway!'));
  });

  it('should expose an accessible PUT HTTP endpoint', function () {
    this.timeout(0);

    return fetch(endpoint, { method: 'PUT' })
      .then(response => response.json())
      .then((json) => expect(json.message).to.equal('Hello from API Gateway!'));
  });

  it('should expose an accessible DELETE HTTP endpoint', function () {
    this.timeout(0);

    return fetch(endpoint, { method: 'DELETE' })
      .then(response => response.json())
      .then((json) => expect(json.message).to.equal('Hello from API Gateway!'));
  });

  after(function () {
    this.timeout(0);

    Utils.removeService();
  });
});
