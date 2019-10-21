const mongoose = require('mongoose');

module.exports = () => {
  // Get all collections in db
  const { collections } = mongoose.connection;

  // Get collection key names
  const collectionKeys = Object.keys(collections);

  // Store the promises from our
  // remove() calls
  const promises = [];

  // Iterate over all collection
  // removing each and storing the promise
  collectionKeys.forEach(key => {
    const promise = collections[key].remove();
    promises.push(promise);
  });

  // Return a single promise
  // that resolves when
  // all collections have been
  // removed
  return Promise.all(promises);
};
