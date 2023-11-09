// src/routes/api/get.js
const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/data/fragment');

const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */

module.exports = async (req, res) => {
  logger.info(`[GET] v1/api/fragments/`);

  try {
    const expand = !!(req.query.expand === '1');
    const fragment = await Fragment.byUser(req.user, expand);
    if (fragment === undefined) throw new Error('Fragment not found');

    res.status(200).json(
      createSuccessResponse({
        fragments: fragment,
      })
    );
  } catch (err) {
    res.status(401).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
