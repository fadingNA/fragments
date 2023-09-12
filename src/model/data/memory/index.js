const MemoryDB = require('./memory-db');

// Create two instances of our in-memory database
const data = new MemoryDB();
const metadata = new MemoryDB();

// Write function fragment return a Promise
const writeFragment = async (fragment) => 
  new Promise((resolve, reject) => {
    try {
      const result = metadata.put(fragment.ownerId, fragment.id, fragment); // PUT
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

// Read a fragment from memory db
const readFragment = (ownerId, id) => 
  new Promise((resolve, reject) => {
    try {
      const result = metadata.get(ownerId, id); // GET
      resolve(result);
    } catch (error) {
      reject(error, {
        message: `Fragment ${id} not found for user ${ownerId}`,
        code: 404,
      });
    }
  });

// write a fragment data buffer to memory db
const writeFragmentData = async (ownerId, id, buffer) => 
  new Promise((resolve, reject) => {
    try {
      const result = data.put(ownerId, id, buffer); // PUT
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

// read a fragment data buffer from memory db
const readFragmentData = (ownerId, id) => 
  new Promise((resolve, reject) => {
    try {
      const result = data.get(ownerId, id); // GET
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

// Get a List of fragment
const listFragments = async (ownerId, expand = false) => {
  const fragments = await metadata.query(ownerId);

  // if we don't get any fragments back, return an empty array
  if (!fragments || expand) {
    return Promise.resolve(fragments);
  }
  // Otherwise map to only send back the ids
  return Promise.resolve(fragments.map((fragment) => fragment.id));
};

const deleteFragment = async (ownerId, id) =>
  Promise.all([metadata.del(ownerId, id), data.del(ownerId, id)]);

module.exports = {
    writeFragment,
    readFragment,
    writeFragmentData,
    readFragmentData,
    listFragments,
    deleteFragment,
}
