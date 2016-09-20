'use strict';

module.exports.hello = (event, context, cb) => {
  process.stdout.write(event.Records[0].eventSource);
  process.stdout.write(event.Records[0].eventName);
  cb(null, { message: 'Hello from S3!', event });
};

module.exports.world = (event, context, cb) => {
  process.stdout.write(event.Records[0].eventSource);
  process.stdout.write(event.Records[0].eventName);
  cb(null, { message: 'Hello from S3!', event });
};
