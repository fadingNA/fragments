const validateKey = (key) => typeof key === 'string';

class MemoryDB {
  constructor() {
    this.db = {};
  }

  /**
   * Gets a value for the given primaryKey and secondaryKey
   * @param {string} primaryKey
   * @param {string} secondaryKey
   * @returns {Promise<any>}
   */

  get(primaryKey, secondaryKey) {
    if (!(validateKey(primaryKey) && validateKey(secondaryKey))) {
      throw new Error(
        `primaryKey and secondaryKey strings are required, got primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }
    // get the database
    const db = this.db;
    // if the primaryKey doesn't exist, return undefined
    const value = db[primaryKey] && db[primaryKey][secondaryKey];
    // return a promise that resolves to the value
    return Promise.resolve(value);
  }
  /**
   * Queries the list of values (i.e., secondaryKeys) for the given primaryKey.
   * Always returns an Array, even if no items are found.
   * @param {string} primaryKey
   * @returns {Promise<any[]>}
   */
  query(primaryKey) {
    if (!validateKey(primaryKey)) {
      throw new Error(`primaryKey string is required, got primaryKey=${primaryKey}`);
    }

    // No matter what, we always return an array (even if empty)
    const db = this.db;
    const values = db[primaryKey] ? Object.values(db[primaryKey]) : [];
    return Promise.resolve(values);
  }
  /**
   * Deletes the value with the given primaryKey and secondaryKey
   * @param {string} primaryKey
   * @param {string} secondaryKey
   * @returns {Promise<void>}
   */
  async del(primaryKey, secondaryKey) {
    if (!(validateKey(primaryKey) && validateKey(secondaryKey))) {
      throw new Error(
        `primaryKey and secondaryKey strings are required, got primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }

    // Throw if trying to delete a key that doesn't exist
    if (!(await this.get(primaryKey, secondaryKey))) {
      throw new Error(
        `missing entry for primaryKey=${primaryKey} and secondaryKey=${secondaryKey}`
      );
    }

    const db = this.db;
    delete db[primaryKey][secondaryKey];
    return Promise.resolve();
  }
}

module.exports = MemoryDB;
