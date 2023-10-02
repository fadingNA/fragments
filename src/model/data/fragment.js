// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

const hash = require('../data/../../../src/hash');

const ContentTypes = [`text/plain`, `text/plain; charset=utf-8`];

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./memory/index');

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
    try {
      ownerId = hash(ownerId); // Ensure ownerId is hashed
      const fragments = await listFragments(ownerId, expand);
      return fragments;
    } catch (err) {
      throw new Error(`Failed to get fragments for user ${ownerId}: ${err.message}`);
    }
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
        throw new Error(`No fragment found for ownerId=${ownerId} and id=${id}`);
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
    try {
      this.updated = new Date().toISOString();
      return writeFragment(this);
    } catch (err) {
      throw new Error(`Failed to save fragment ${this.id}: ${err.message}`);
    }
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    try {
      return await readFragmentData(this.ownerId, this.id);
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
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
    try {
      this.size = Buffer.byteLength(data);
      await this.save();
      return await writeFragmentData(this.ownerId, this.id, data);
    } catch (e) {
      throw new Error(`Failed to set fragment data: ${e.message}`);
    }
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
