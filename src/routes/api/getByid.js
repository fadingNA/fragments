const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/data/fragment');
const logger = require('../../logger');
const path = require('path');
const mdit = require('markdown-it');

async function convertMarkdownToHtml(retrieved_fragment) {
  const dataBuffer = await retrieved_fragment.getData();
  const dataString = dataBuffer.toString(); // Convert buffer to string
  const md = new mdit();
  return md.render(dataString); // Convert Markdown to HTML
}

module.exports = async (req, res) => {
  logger.info(`[GET] v1/api/fragments/${req.params.id}`);
  try {
    const fragment_id = path.basename(req.params.id, path.extname(req.params.id));
    const conversion = path.extname(req.params.id);
    const retrieved_fragment = await Fragment.byId(req.user, fragment_id);

    if (conversion && !retrieved_fragment.formats.includes(conversion.substring(1))) {
      console.log(conversion.substring(1));
      return res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
    }

    if (conversion === '.html' && retrieved_fragment.type === 'text/markdown') {
      const html_content = await convertMarkdownToHtml(retrieved_fragment);
      res.set('Content-Type', 'text/html');
      res.status(200).send(html_content);
    } else {
      const retrieved_fragment_data = await retrieved_fragment.getData();
      res.set('Content-Type', retrieved_fragment.type);
      res.status(200).send(retrieved_fragment_data);
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json(createErrorResponse(500, err.message));
  }
};
