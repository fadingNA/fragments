const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/data/fragment');
const logger = require('../../logger');

const API_URL = process.env.API_URL;
 
/**
 * POST /fragments
 * Creates a new fragment for the current (i.e., authenticated user)
 */
const postFragments = async (req, res) => {
  logger.info(`[POST] v1/api/fragments/${req.params.id}`);
  const user = req.user;
  const data = req.body;
  const type = req.headers['content-type'];
  // Check the Content-Type is supported or not
  try {
    if (Fragment.isSupportedType(type)) {
      logger.debug(`Creating new fragment for user ${user} with type ${type}`);
      const fragment = new Fragment({ ownerId: user, type });
      await fragment.setData(data);

      logger.info('Fragment Created setHeader');
      res.setHeader('Content-type', fragment.type);
      res.setHeader('Location', `${API_URL}/v1/fragments/${fragment.id}`);

      return res.status(200).json(
        createSuccessResponse({
          fragment,
        })
      );
    } else {
      logger.error(`${type} is not supported Content Type`);
      res.status(415).json(createErrorResponse(415, `${type} is not supported Content Type`));
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json(createErrorResponse(500, err.message));
  }
};

module.exports = postFragments;
