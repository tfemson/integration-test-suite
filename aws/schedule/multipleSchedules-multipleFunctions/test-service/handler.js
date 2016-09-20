'use strict';

module.exports.hello = (event, context, cb) => {
  process.stdout.write(event.source);
  process.stdout.write(event['detail-type']);
  cb(null, { message: 'Hello from Schedule!', event });
};

module.exports.world = (event, context, cb) => {
  process.stdout.write(event.source);
  process.stdout.write(event['detail-type']);
  cb(null, { message: 'Hello from Schedule!', event });
};
