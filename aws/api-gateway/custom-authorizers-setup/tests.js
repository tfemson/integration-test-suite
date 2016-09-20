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

describe('AWS - API Gateway: Custom authorizers setup test', () => {
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

  it('should reject requests without authorization', function () {
    this.timeout(0);

    return fetch(endpoint)
      .then((response) => {
        expect(response.status).to.equal(401);
      });
  });

  it('should reject requests with wrong authorization', function () {
    this.timeout(0);

    return fetch(endpoint, { headers: { Authorization: 'Bearer ShouldNotBeAuthorized' } })
      .then((response) => {
        expect(response.status).to.equal(401);
      });
  });

  it('should authorize requests with correct authorization', function () {
    this.timeout(0);

    return fetch(endpoint, { headers: { Authorization: 'Bearer ShouldBeAuthorized' } })
      .then(response => response.json())
      .then((json) => {
        expect(json.message).to.equal('Successfully authorized!');
        expect(json.event.principalId).to.equal('SomeRandomId');
        expect(json.event.headers.Authorization).to.equal('Bearer ShouldBeAuthorized');
      });
  });

  after(function () {
    this.timeout(0);

    Utils.removeService();
  });
});
