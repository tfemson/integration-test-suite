'use strict';

const path = require('path');
const os = require('os');
const fse = require('fs-extra');
const execSync = require('child_process').execSync;

const serverlessExec = path.join(process.cwd(), 'node_modules', 'serverless', 'bin', 'serverless');

module.exports = {
  serverlessExec,
  createTestService: (templateName, testServiceDir) => {
    const serviceName = `service-${(new Date()).getTime().toString()}`;
    const tmpDir = path.join(os.tmpdir(), (new Date()).getTime().toString());

    fse.mkdirsSync(tmpDir);
    process.chdir(tmpDir);

    // create a new Serverless service
    execSync(`${serverlessExec} create --template ${templateName}`, { stdio: 'inherit' });

    if (testServiceDir) {
      fse.copySync(testServiceDir, tmpDir, { clobber: true, preserveTimestamps: true });
    }

    execSync(`sed -i.bak s/${templateName}/${serviceName}/g serverless.yml`);

    // return the name of the CloudFormation stack
    return `${serviceName}-dev`;
  },
};
