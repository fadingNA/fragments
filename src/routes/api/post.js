const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/data/fragment');
const logger = require('../../logger');

const API_URL = process.env.API_URL;

/**
 * POST /fragments
 * Creates a new fragment for the current (i.e., authenticated user)
 */
const postFragments = async (req, res) => {
  const user = req.user;
  const data = req.body;
  console.log(data);

  const type = req.headers['content-type'];
  console.log('Content Type:', type);
  console.log('User:', user);
  console.log('Data:', data);

  // Check the Content-Type is supported or not
  if (Fragment.isSupportedType(type)) {
    console.log('Inside if Content Type:', type);
    try {
      // Generate a new Fragment metadata record based on Request
      const fragment = new Fragment({ ownerId: user, type });
      console.log(fragment);
      // Store metadata and data
      await fragment.setData(data);

      // Set headers
      res.setHeader('Content-type', fragment.type);
      res.setHeader('Location', `${API_URL}/v1/fragments/${fragment.id}`);

      // Return successful response
      res.status(201).json(
        createSuccessResponse({
          fragment,
        })
      );
    } catch (err) {
      logger.error(err.message, 'Something went wrong...');
      res.status(500).json(createErrorResponse(401, err.message));
    }
  } else {
    logger.error(`${type} is not supported Content Type`);
    res.status(415).json(createErrorResponse(415, `${type} is not supported Content Type`));
  }
};

module.exports = postFragments;
