const {getUser} = require('../utils/users');
const {getCredentials} = require('../utils/requestUtils');
const User = require('../models/user');

/**
 * Get current user based on the request headers
 *
 * @param {object} request http.IncomingMessage
 * @returns {object|null} current authenticated user or null if not yet authenticated
 */
const getCurrentUser = async ( request ) => {
  // TODO: 8.4 Implement getting current user based on the "Authorization" request header

  // NOTE: You can use getCredentials(request) function from utils/requestUtils.js
  // and getUser(email, password) function from utils/users.js to get the currently
  // logged in user
  const credential = getCredentials(request);
  if (credential !== null) {
    
    const user = await User.findOne({ email: credential[0]}).exec();
    if (user) {
      const passwordMatches = await user.checkPassword(credential[1]);
      if (passwordMatches) {
        return user;
      }
    }
    return null;
  } else {
    return null;
  }
};

module.exports = { getCurrentUser };
