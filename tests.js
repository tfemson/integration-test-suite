'use strict';

// General (Serverless)
// Custom Plugin
require('./general/serverless/custom-plugins/tests');

// AWS
// General
require('./aws/general/deploy-invoke-remove-lifecycle/tests');

// Custom resources
require('./aws/general/custom-resources/tests');

// API Gateway
require('./aws/api-gateway/simple-api-setup/tests');
require('./aws/api-gateway/custom-authorizers-setup/tests');
require('./aws/api-gateway/cors-setup/tests');

// Schedule
require('./aws/schedule/multipleSchedules-multipleFunctions/tests');

// General (Serverless)
// Custom Plugin
require('./general/serverless/custom-plugins/tests');

// Functions
require('./general/serverless/functions/nested-handler-file/tests');
