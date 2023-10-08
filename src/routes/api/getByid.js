const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/data/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.debug(`[GET] v1/api/fragments/${req.params.id}`);

  try {
    const fragment_id = req.params.Id.split('.')[0];
    console.log(fragment_id);
    logger.debug({ body: req.body }, 'Request body');

    const retrieved_fragment = await Fragment.byId(req.user, fragment_id);
    console.log(retrieved_fragment, 'retrieved fragment');

    if (!retrieved_fragment) {
      return createErrorResponse(res, 404, 'Fragment not found');
    }

    const retrieved_fragment_data = await retrieved_fragment.getData();

    console.log(retrieved_fragment_data, 'retrieved fragment data');

    if (!retrieved_fragment_data) {
      return createErrorResponse(res, 404, 'Fragment data not found');
    }

    res.set('Content-Type', retrieved_fragment.type);
    res.status(200).send(retrieved_fragment_data);


  } catch (err) {
    logger.error(err);
    res.status(500).json(createErrorResponse(500, err.message))
  }
};
