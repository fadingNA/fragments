const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/data/fragment');
const logger = require('../../logger');
const path = require('path');

module.exports = async (req, res) => {
  logger.info(`[GET] v1/api/fragments/${req.params.id}`);
  try {
    const fragment_id = path.basename(req.params.id, path.extname(req.params.id));
    
    const retrieved_fragment = await Fragment.byId(req.user, fragment_id);

    if (!retrieved_fragment) {
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    

    const retrieved_fragment_data = await retrieved_fragment.getData();
    res.set('Content-Type', retrieved_fragment.type);
    res.status(200).send(retrieved_fragment_data);
  } catch (err) {
    logger.error(err);
    res.status(500).json(createErrorResponse(500, err.message));
  }
};
