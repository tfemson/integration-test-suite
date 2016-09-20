'use strict';

const path = require('path');
const expect = require('chai').expect;
const AWS = require('aws-sdk');
const BbPromise = require('bluebird');
const _ = require('lodash');
const fse = require('fs-extra');
const crypto = require('crypto');

const Utils = require('../../../utils/index');

const CF = new AWS.CloudFormation({ region: 'us-east-1' });
const S3 = new AWS.S3({ region: 'us-east-1' });
BbPromise.promisifyAll(CF, { suffix: 'Promised' });
BbPromise.promisifyAll(S3, { suffix: 'Promised' });

describe('General - Serverless: Custom resources test', () => {
  let stackName;
  let s3BucketName;

  before(function () {
    this.timeout(0);

    stackName = Utils.createTestService('aws-nodejs', path.join(__dirname, 'test-service'));

    // replace name of bucket which is created through custom resources with something unique
    const serverlessYmlFilePath = path.join(process.cwd(), 'serverless.yml');
    let serverlessYmlFileContent = fse.readFileSync(serverlessYmlFilePath).toString();

    s3BucketName = crypto.randomBytes(8).toString('hex');

    serverlessYmlFileContent = serverlessYmlFileContent
      .replace(/WillBeReplacedBeforeDeployment/, s3BucketName);

    fse.writeFileSync(serverlessYmlFilePath, serverlessYmlFileContent);

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
        { Name: s3BucketName }))
      .then((found) => expect(found).to.equal(true));
  });

  after(function () {
    this.timeout(0);

    Utils.removeService();
  });
});
