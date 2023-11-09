const markdownIt = require('markdown-it')();
const { Fragment } = require('../../model/data/fragment');
const logger = require('../../logger');
const { createErrorResponse } = require('../../response');

module.exports = async (req,res) => {
  const { id, ext } = req.params;

  // If the extension is not 'md', we assume it's not supported
  if (ext !== 'md') {
    logger.error(`Unsupported file extension: .${ext}`);
    return res.status(415).json(createErrorResponse(415, 'Unsupported file extension'));
  }

  try {
    logger.info(`Fetching fragment ${id} as Markdown`);
    const fragment = await Fragment.byId(req.user, id);

    // Ensure the fragment exists
    if (!fragment) {
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    // Convert Markdown to HTML
    const html = markdownIt.render(fragment.content);
    return res.status(200).send(html);
  } catch (err) {
    logger.error(err);
    return res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
}


