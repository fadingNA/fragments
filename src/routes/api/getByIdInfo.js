const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/data/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.info(`[GET] v1/api/fragments/${req.params.id}/info`);
  try {
    const fragments = await Fragment.byId(req.user, req.params.id);

    if (!fragments) {
      throw new Error('Fragment not found');
    }

    res.status(200).json(
      createSuccessResponse({
        fragments: fragments,
      })
    );
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
