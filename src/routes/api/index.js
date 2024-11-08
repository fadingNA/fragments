// src/routes/api/index.js
const express = require('express');
const contentType = require('content-type');
const { Fragment } = require('../../../src/model/data/fragment');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));

// Other routes will go here later on...

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

//[POST] v1/api/fragments
router.post('/fragments', rawBody(), require('./post'));

// [GET] v1/api/fragments/:id
router.get('/fragments/:id', require('./getByid'));
router.get('/fragments/:id/info', require('./getByIdInfo'));

// [DELETE] v1/api/fragments/:id
router.delete('/fragments/:id', require('./delete'));

// [PUT / Update] v1/api/fragments/put
router.put('/fragments/:id', rawBody(), require('./put'));

module.exports = router;
