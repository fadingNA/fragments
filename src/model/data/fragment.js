// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

const hash = require('../data/../../../src/hash')

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
    // TODO
    this.id = id || randomUUID(); //using a UUID with the built-in crypto module
    this.ownerId = hash(ownerId); // using hash email
    this.created = created || new Date().toISOString(); // ISO 8601 string
    this.updated = updated || new Date().toISOString();
    if (type === undefined) throw new Error('Fragment type is required');
    if (!Fragment.isSupportedType(type)) throw new Error(`Unsupported type: ${type}`);
    else this.type = type;
    if (!Number.isInteger(size) || size < 0) throw new Error('Fragment size must be a non-negative integer');
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    // TODO
    const fragments = await listFragments(ownerId, expand);
    if (!fragments) throw new Error(`No fragments found for user ${ownerId}`);
    if (expand) return fragments.map((fragmentData) => new Fragment(fragmentData));
    return fragments.map((fragmentId) => new Fragment({ ownerId, id: fragmentId }));
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    // TODO
    const fData = readFragment(ownerId, id);
    if (!fData) throw new Error(`Fragment ${id} not found for user ${ownerId}`);
    return new Fragment(fData);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static async delete(ownerId, id) {
    // TODO
    try {
      await deleteFragment(ownerId, id);
    } catch {
      throw new Error(`Fragment ${id} not found for user ${ownerId}`);
    }
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    // TODO
    try {
      writeFragment(this.ownerId, this.id, this);
    } catch {
      throw new Error(`Fragment ${this.id} not found for user ${this.ownerId}`);
    }
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    // TODO
    if (!this.isText) throw new Error(`Fragment ${this.id} is not text type for user ${this.ownerId}`);
    try {
      return readFragmentData(this.ownerId, this.id);
    } catch (error) {
      throw new Error(`Failed to get fragment data: ${error.message}`);
    }
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  setData(data) {
    // TODO
    try {
      writeFragmentData(this.ownerId, this.id, data);
    } catch {
      throw new Error(`Fragment ${this.id} not found for user ${this.ownerId}`);
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
    // TODO
    const supportedTypes = ['text/plain', 'text/plain: charset=utf-8'];
    const parsedValue = contentType.parse(value).type;
    // will return true if parsedValue is in supportedTypes
    return supportedTypes.includes(parsedValue);
  }
}

module.exports.Fragment = Fragment;
