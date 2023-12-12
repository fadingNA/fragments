const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/data/fragment');
const logger = require('../../logger');
const path = require('path');
const mdit = require('markdown-it');
const sharp = require('sharp');

async function convertMarkdownToHtml(retrieved_fragment, res) {
  const dataBuffer = await retrieved_fragment.getData();
  const dataString = dataBuffer.toString();
  const md = new mdit();
  const html_content = md.render(dataString);
  res.set('Content-type', 'text/html');
  res.status(200).send(html_content);
}

async function convertToImage(retrievedFragment, res, format) {
  const dataBuffer = await retrievedFragment.getData();

  try {
    let convertedImageData;

    if (format === 'image/png') {
      convertedImageData = await sharp(dataBuffer).png().toBuffer();
    } else if (format === 'image/gif') {
      convertedImageData = await sharp(dataBuffer).gif().toBuffer();
    } else if (format === 'image/webp') {
      convertedImageData = await sharp(dataBuffer).webp().toBuffer();
    } else if (format === 'image/jpeg') {
      convertedImageData = await sharp(dataBuffer).jpeg().toBuffer();
    } else {
      convertedImageData = dataBuffer;
    }

    res.set('Content-Type', format);
    res.status(200).send(convertedImageData);
  } catch (error) {
    logger.error('Error in image conversion:', error);
    return createErrorResponse(415, 'Unsupported Media Typ1');
  }
}

module.exports = async (req, res) => {
  try {
    logger.info(`[GET] v1/api/fragments/${req.params.id}`);

    const fragment_id = path.basename(req.params.id, path.extname(req.params.id));
    const conversion = path.extname(req.params.id);
    const retrieved_fragment = await Fragment.byId(req.user, fragment_id);

    if (!retrieved_fragment) {
      return res.status(404).json(createErrorResponse(404, 'Not Found'));
    }

    if (conversion && !retrieved_fragment.formats.includes(conversion.substring(1))) {
      return res.status(415).json(createErrorResponse(415, 'Unsupported Media Type2'));
    }

    if (conversion === '.html' && retrieved_fragment.type === 'text/markdown') {
      await convertMarkdownToHtml(retrieved_fragment, res);
    } else if (conversion && retrieved_fragment.type.startsWith('image/')) {
      let format = retrieved_fragment.type;
      await convertToImage(retrieved_fragment, res, format);
    } else {
      const retrieved_fragment_data = await retrieved_fragment.getData();
      res.set('Content-type', retrieved_fragment.type);
      res.status(200).send(retrieved_fragment_data);
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
};
