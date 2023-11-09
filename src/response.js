// src/response.js

module.exports.createSuccessResponse = function (data) {
  return {
    ...data,
    status: 'ok',
  };
};

module.exports.createErrorResponse = function (code, message) {
  return {
    status: 'error',
    error: {
      code: code,
      message: message,
    },
  };
};
