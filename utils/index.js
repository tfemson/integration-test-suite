'use strict';

const path = require('path');
const os = require('os');
const fse = require('fs-extra');
const execSync = require('child_process').execSync;

const serverlessExec = path.join(process.cwd(), 'node_modules', 'serverless', 'bin', 'serverless');
const tmpDir = path.join(os.tmpdir(), (new Date()).getTime().toString());
const serviceName = `service-${(new Date()).getTime().toString()}`;
const stackName = `${serviceName}-dev`;

module.exports = {
  serverlessExec,
  tmpDir,
  serviceName,
  stackName,
  createTestService: (templateName, assetsToCopy) => {
    fse.mkdirSync(tmpDir);
    process.chdir(tmpDir);

    // create a new Serverless service
    execSync(`${serverlessExec} create --template ${templateName}`, { stdio: 'inherit' });

    // copy over all the files and folders which are necessary for the test
    let stuffToCopyOver = assetsToCopy;
    stuffToCopyOver = stuffToCopyOver || [];
    if (stuffToCopyOver.length) {
      stuffToCopyOver.forEach((srcPath) => {
        // note: right now only files are supported
        const filename = srcPath.split(path.sep).pop();

        fse.copySync(srcPath, path.join(tmpDir, filename), {
          clobber: true,
          preserveTimestamps: true,
        });
      });
    }

    execSync(`sed -i.bak s/${templateName}/${serviceName}/g serverless.yml`);

    return tmpDir;
  },
};
