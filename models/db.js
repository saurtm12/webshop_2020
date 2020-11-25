const mongoose = require('mongoose');

/**
 * Get database connect URL.
 *
 * Reads URL from DBURL environment variable or
 * returns default URL if variable is not defined
 *
 * @returns {string} connection URL
 */
const getDbUrl = () => {
  // TODO: 9.3 Implement this
  return process.env.DBURL !== undefined ? process.env.DBURL : 'mongodb://localhost:27017/WebShopDb';
};
/**
 * Connect to DB
 *
 */
function connectDB () {
  // Do nothing if already connected
  if (!mongoose.connection || mongoose.connection.readyState === 0) {
    mongoose
      .connect(getDbUrl(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoIndex: true
      })
      .then(() => {
        mongoose.connection.on('error', err => {
          console.error(err);
        });

        mongoose.connection.on('reconnectFailed', handleCriticalError);
      })
      .catch(handleCriticalError);
  }
}

/**
 * Handle critical errors
 * 
 * Handles critical errors by throwing error
 * 
 * @param {object} err error
 * @throws {object} error
 */
function handleCriticalError (err) {
  console.error(err);
  throw err;
}

/**
 * Disconnect from DB
 *
 */
function disconnectDB () {
  mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB, getDbUrl };
