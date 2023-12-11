const { Fragment } = require('../../model/data/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');
const API_URL = process.env.API_URL || 'http://localhost:8080';

const putFragments = async (req, res) => {
  logger.info('[PUT] /v1/fragments/:id');
  const id = req.params.id.split('.')[0];
  const type = req.headers['content-type'];

  try {
    if (Fragment.isSupportedType(type)) {
      logger.debug({ id }, 'Retrieving fragment');
      const fragment = await Fragment.byId(req.user, id);
      logger.debug({ fragment }, 'Fragment retrieved');
      if (!fragment) {
        return res.status(404).json(createErrorResponse(404, 'No fragment with this id'));
      }
      fragment.updated = new Date();
      await fragment.setData(req.body);
      res.setHeader('Content-type', fragment.type);
      res.setHeader('Location', `${API_URL}/v1/fragments/${fragment.id}`);
      await fragment.save();

      res.status(200).json(
        createSuccessResponse({
          fragment,
        })
      );
    }
  } catch (err) {
    logger.error({ err }, 'ERROR! Unable to update fragment');
    res.status(444).json(
      createErrorResponse(444, {
        message: 'Error Put',
        error: err,
      })
    );
  }
};

module.exports = putFragments;
