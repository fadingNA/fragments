const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/data/fragment');
const logger = require('../../logger');
const path = require('path');
const mdit = require('markdown-it');
const sharp = require('sharp');
const contentType = require('content-type');

const imageTypes = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

function getMimeType(fragment) {
  const { type } = contentType.parse(fragment.type);
  return type.split(';')[0].toLowerCase().trim();
}

async function convertMarkdownToHtml(retrieved_fragment, res) {
  const dataBuffer = await retrieved_fragment.getData();
  const dataString = dataBuffer.toString();
  const md = new mdit();
  const html_content = md.render(dataString);
  res.set('Content-Type', 'text/html');
  res.status(200).send(html_content);
}

async function convertToImage(retrievedFragment, res) {
  const dataBuffer = await retrievedFragment.getData();

  const imageType = retrievedFragment.type;
  if (imageTypes[imageType]) {
    try {
      if (imageType === 'image/png') {
        const convertedImageData = await sharp(dataBuffer).png().toBuffer();
        dataBuffer.data = convertedImageData;
      }
      if (imageType === 'image/jpeg') {
        const convertedImageData = await sharp(dataBuffer).jpeg().toBuffer();
        dataBuffer.data = convertedImageData;
      }
      if (imageType === 'image/gif') {
        const convertedImageData = await sharp(dataBuffer).gif().toBuffer();
        dataBuffer.data = convertedImageData;
      }
      if (imageType === 'image/webp') {
        const convertedImageData = await sharp(dataBuffer).webp().toBuffer();
        dataBuffer.data = convertedImageData;
      }
    } catch (error) {
      return createErrorResponse(415, 'Unsupported Media Type');
    }

    res.set('Content-Type', getMimeType(retrievedFragment));
    res.status(200).send(retrievedFragment.getData());
  } else {

    return createErrorResponse(415, 'Unsupported Media Type');
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

      return res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
    }

    if (conversion === '.html' && retrieved_fragment.type === 'text/markdown') {
      await convertMarkdownToHtml(retrieved_fragment, res);
    } else if (conversion && retrieved_fragment.type.startsWith('image/')) {
      await convertToImage(retrieved_fragment, res);
    } else {
      const retrieved_fragment_data = await retrieved_fragment.getData();
      res.set('Content-Type', retrieved_fragment.type);
      res.status(200).send(retrieved_fragment_data);
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
};
