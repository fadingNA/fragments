// src/auth/index.js

console.log("Inside auth/index.js");
console.log("process.env.AWS_COGNITO_POOL_ID: ", process.env.AWS_COGNITO_POOL_ID);
console.log("process.env.AWS_COGNITO_CLIENT_ID: ", process.env.AWS_COGNITO_CLIENT_ID);
let strategy;
  // Prefer Amazon Cognito
if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  console.log("Inside if");
  strategy = require('./cognito');
}
// Also allow for an .htpasswd file to be used, but not in production
else if (process.env.HTPASSWD_FILE && process.NODE_ENV !== 'production') {
  console.log("Inside else if");
  strategy = require('./basic-auth');
}
// In all other cases, we need to stop now and fix our config
else {
  throw new Error('missing env vars: no authorization configuration found');
}


module.exports = strategy;
