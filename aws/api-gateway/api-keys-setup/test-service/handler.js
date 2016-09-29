'use strict';

// Your first function handler
module.exports.hello = (event, context, cb) => cb(null,
  { message: 'Hello from API Gateway!', event }
);
