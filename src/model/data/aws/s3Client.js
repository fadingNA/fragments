// src/model/data/aws/s3Client.js
const { S3Client } = require('@aws-sdk/client-s3');
const logger = require('../../../logger');

// Create an S3 client

const getCredentials = () => {
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    const credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN,
    };
    logger.debug('Using extra s3 credentials AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
    return credentials;
  }
};

const getS3Endpoint = () => {
  if (process.env.AWS_S3_ENDPOINT_URL) {
    logger.debug(
      {
        endpoint: process.env.AWS_S3_ENDPOINT_URL,
      },
      'Using extra s3 endpoint'
    );
    return process.env.AWS_S3_ENDPOINT_URL;
  }
};

module.exports = new S3Client({
  region: process.env.AWS_REGION,
  credentials: getCredentials(),
  endpoint: getS3Endpoint(),
  forcePathStyle: true,
});
