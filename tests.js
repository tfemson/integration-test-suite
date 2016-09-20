'use strict';

// AWS
// General
require('./aws/general/deploy-invoke-remove-lifecycle/tests');

// API Gateway
require('./aws/api-gateway/simple-api-setup/tests');
require('./aws/api-gateway/custom-authorizers-setup/tests');
require('./aws/api-gateway/cors-setup/tests');

// Custom resources
require('./aws/general/custom-resources/tests');

// General (Serverless)
// Custom Plugin
require('./general/serverless/custom-plugins/tests');
