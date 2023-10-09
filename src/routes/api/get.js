// src/routes/api/get.js
const { createSuccessResponse } = require('../../response');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */

module.exports = (req, res) => {
  logger.info(`[GET] v1/api/fragments/`);
  res.status(200).json(
    createSuccessResponse({
      fragments: [],
      message: '[GET] v1/api/fragments' + req.params.id,
    })
  );
};
