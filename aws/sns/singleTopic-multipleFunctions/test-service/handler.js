'use strict';

module.exports.hello = (event, context, cb) => {
  process.stdio.write(event.Records[0].EventSource);
  process.stdio.write(event.Records[0].Sns.Message);
  cb(null, { message: 'Hello from SNS!', event });
};

module.exports.world = (event, context, cb) => {
  process.stdio.write(event.Records[0].EventSource);
  process.stdio.write(event.Records[0].Sns.Message);
  cb(null, { message: 'Hello from SNS!', event });
};
