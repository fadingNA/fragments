// src/model/data/index.js

const logger = require('../../logger');

// If the env sets an AWS REGION, use that
// service s S3 DynamoDB other we will use the in-memory db
logger.info(`[DATA] Using ${process.env.AWS_REGION ? 'AWS' : 'memory'} data store`);
module.exports = process.env.AWS_REGION ? require('./aws') : require('./memory');

