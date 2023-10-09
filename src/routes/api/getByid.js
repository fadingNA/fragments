const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/data/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.info(`[GET] v1/api/fragments/${req.params.id}`);

  try {
    const fragment_id = req.params.id.split('.')[0];

    const retrieved_fragment = await Fragment.byId(req.user, fragment_id);


    if (!retrieved_fragment) {
      logger.error(`Fragment ${fragment_id} not found`);
      return createErrorResponse(res, 415, 'Fragment not found');
    }

    const retrieved_fragment_data = await retrieved_fragment.getData();

    if (!retrieved_fragment_data) {
      logger.error(`Fragment data ${fragment_id} not found`);
      return createErrorResponse(res, 415, 'Fragment data not found');
    }

    res.set('Content-Type', retrieved_fragment.type);
    res.status(200).send(retrieved_fragment_data);
  } catch (err) {
    logger.error(err);
    res.status(500).json(createErrorResponse(500, err.message));
  }
};
