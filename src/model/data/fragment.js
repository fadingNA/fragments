// fragment.js
const { randomUUID } = require('crypto');
const contentType = require('content-type');
const hash = require('../data/../../../src/hash');
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./memory/index');

const ContentTypes = [`text/plain`, `text/plain; charset=utf-8`];

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    this.id = id || randomUUID();

    if (!ownerId || !type) throw new Error('ownerId and type are required');
    ownerId = hash(ownerId);
    this.ownerId = ownerId;

    if (typeof size !== 'number' || size < 0) throw new Error('size must be a number and positive');
    this.size = size;

    if (!Fragment.isSupportedType(type)) throw new Error(`${type} is invalid types`);
    this.type = type;

    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    if (ownerId === undefined) throw new Error('ownerId is required');
    ownerId = hash(ownerId); // Ensure ownerId is hashed
    const fragments = await listFragments(ownerId, expand);
    return fragments;
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    try {
      ownerId = hash(ownerId); // Ensure ownerId is hashed
      const fragment = await readFragment(ownerId, id);
      if (!fragment) {
        const error = new Error(`No fragment found for ownerId=${ownerId} and id=${id}`);
        error.code = 404;
        throw error;
      }

      return fragment instanceof Fragment ? fragment : new Fragment(fragment);
    } catch (err) {
      throw new Error(err);
    }
  }
  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    // TODO
    try {
      ownerId = hash(ownerId); // Ensure ownerId is hashed
      return deleteFragment(ownerId, id);
    } catch {
      throw new Error(`Fragment ${id} not found for user ${ownerId}`);
    }
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
      this.updated = new Date().toISOString();
      return writeFragment(this); 
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    return await readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (!data || !(data instanceof Buffer) || !Buffer.isBuffer(data)) {
      throw new Error(`Fragment ${this.id} data must be a Buffer`);
    }
    this.size = Buffer.byteLength(data);
    await this.save();
    return await writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.mimeType.startsWith('text/');
  }
  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // TODO
    const conver = {
      'text/plain': ['text/html', 'application/json'],
      'text/plain; charset=utf-8': ['text/plain'],
    };
    if (!conver[this.type]) throw new Error(`No supported formats for ${this.type}`);
    return conver[this.type];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */

  static isSupportedType(value) {
    return ContentTypes.includes(value);
  }
}

module.exports.Fragment = Fragment;
