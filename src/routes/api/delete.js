const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/data/fragment');
const logger = require('../../logger');

const deleteFrags = async (req, res) => {
  logger.info(`[DELETE] v1/api/fragments/`);
  try {
    const id = req.params.id;
    const fragments_byId = await Fragment.byId(req.user, id);
    if (!fragments_byId) {
      res.status(404).json(createErrorResponse(`Fragment ${id} not found for user ${req.user}`));
      return;
    }
    await Fragment.delete(req.user, id);
    res.status(200).json(createSuccessResponse('Fragment Deleted'));
  } catch (err) {
    console.log('Error is: ', err);
    res.status(500).json(createErrorResponse('Internal Server Error'));
  }
};

module.exports = deleteFrags;
