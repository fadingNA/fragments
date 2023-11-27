// src/model/data/index.js

// If the env sets an AWS REGION, use that
// service s S3 DynamoDB other we will use the in-memory db

module.exports = process.env.AWS_REGION ? require('./aws') : require('./memory');

