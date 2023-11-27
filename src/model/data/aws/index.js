// XXX: temporary use of memory-db until we add DynamoDB

const s3Client = require('./s3Client');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

async function writeFragmentData(ownerId, id, data) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
    Body: data,
  };
  const command = new PutObjectCommand(params);
  try {
    await s3Client.send(command);
  } catch (err) {
    const { Bucket, Key } = params;
    console.error(`Error uploading ${Key} to ${Bucket}: ${err}`);
    throw new Error('Error uploading fragment data');
  }
}

const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

async function readFragmentData(ownerId, id) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };
  try {
    const data = await s3Client.send(params);
    return streamToBuffer(data.Body);
  } catch (err) {
    const { Bucket, Key } = params;
    console.error(`Error downloading ${Key} from ${Bucket}: ${err}`);
    throw new Error('Error downloading fragment data');
  }
}

async function deleteFragment(ownerId, id) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  const command = new DeleteObjectCommand(params);
  try {
    await s3Client.send(command);
  } catch (err) {
    const { Bucket, Key } = params;
    console.error(`Error deleting ${Key} from ${Bucket}: ${err}`);
    throw new Error('Error deleting fragment data');
  }
}

module.exports = {
  writeFragmentData,
  readFragmentData,
  deleteFragment,
};
