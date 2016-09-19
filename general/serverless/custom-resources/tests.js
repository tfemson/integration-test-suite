'use strict';

const path = require('path');
const expect = require('chai').expect;
const AWS = require('aws-sdk');
const BbPromise = require('bluebird');
const _ = require('lodash');

const Utils = require('../../../utils/index');

const CF = new AWS.CloudFormation({ region: 'us-east-1' });
const S3 = new AWS.S3({ region: 'us-east-1' });
BbPromise.promisifyAll(CF, { suffix: 'Promised' });
BbPromise.promisifyAll(S3, { suffix: 'Promised' });

describe('General - Serverless: Custom resources test', () => {
  let stackName;

  before(function () {
    this.timeout(0);

    stackName = Utils.createTestService('aws-nodejs', path.join(__dirname, 'test-service'));
    Utils.deployService();
  });

  it('should add the custom outputs to the Outputs section', function () {
    this.timeout(0);

    return CF.describeStacksPromised({ StackName: stackName })
      .then((result) => _.find(result.Stacks[0].Outputs,
        { OutputKey: 'MyCustomOutput' }).OutputValue)
      .then((endpointOutput) => {
        expect(endpointOutput).to.equal('SomeValue');
      });
  });

  it('should create the custom resources (a S3 bucket)', function () {
    this.timeout(0);

    return S3.listBucketsPromised()
      .then((result) => !!_.find(result.Buckets,
        { Name: 'com.serverless.tests.integration.my.custom.s3.bucket' }))
      .then((found) => expect(found).to.equal(true));
  });

  after(function () {
    this.timeout(0);

    Utils.removeService();
  });
});
