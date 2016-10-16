'use strict';

// AWS
// General
require('./aws/general/deploy-invoke-remove-lifecycle/tests');
require('./aws/general/custom-resources/tests');

// API Gateway
// Integration: Lambda
require('./aws/api-gateway/integration-lambda/simple-api-setup/tests');
require('./aws/api-gateway/integration-lambda/custom-authorizers-setup/tests');
require('./aws/api-gateway/integration-lambda/cors-setup/tests');
require('./aws/api-gateway/integration-lambda/api-keys-setup/tests');
// Integration: Lambda Proxy
require('./aws/api-gateway/integration-lambda-proxy/simple-api-setup/tests');

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
