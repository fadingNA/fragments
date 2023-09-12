const MemoryDB = require('./memory-db');

// Create two instances of our in-memory database
const data = new MemoryDB();
const metadata = new MemoryDB();

// Write function fragment return a Promise
const writeFragment = (fragment) => metadata.put(fragment.ownerId, fragment.id, fragment);

// Read a fragment from memory db
const readFragment = (ownerId, id) => metadata.get(ownerId, id);

// write a fragment data buffer to memoery db
const writeFragmentData = (ownerId, id, buffer) => data.put(ownerId, id, buffer);

// read a fragment data buffer from memory db
const readFragmentData = (ownerId, id) => data.get(ownerId, id);

// Get a List of fragment
const listFragments = async (ownerId, expand = false) => {
  const fragments = await metadata.query(ownerId);

  // if we dont' get any fragments back, return an empty array
  if (expand || !fragments) {
    return fragments;
  }
  // Otherwise map to only sendback the ids
  return fragments.map((fragment) => fragment.id);
};

const deleteFragment = (ownerId, id) =>
  Promise.all([metadata.del(ownerId, id), data.del(ownerId, id)]);

module.exports = {
    writeFragment,
    readFragment,
    writeFragmentData,
    readFragmentData,
    listFragments,
    deleteFragment,
}
