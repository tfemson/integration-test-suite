'use strict';

// AWS
// General
require('./aws/general/deploy-invoke-remove-lifecycle/tests');
require('./aws/general/custom-resources/tests');

// API Gateway
require('./aws/api-gateway/simple-api-setup/tests');
require('./aws/api-gateway/custom-authorizers-setup/tests');
require('./aws/api-gateway/cors-setup/tests');

// Schedule
require('./aws/schedule/multipleSchedules-multipleFunctions/tests');

// SNS
require('./aws/sns/multipleTopics-multipleFunctions/tests');
require('./aws/sns/multipleTopics-singleFunction/tests');
require('./aws/sns/singleTopic-multipleFunctions/tests');
require('./aws/sns/singleTopic-singleFunction/tests');

// General (Serverless)
// Custom Plugin
require('./general/serverless/custom-plugins/tests');
require('./general/serverless/functions/nested-handler-file/tests');
