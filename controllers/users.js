/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response
 */
const responseUtils = require('../utils/responseUtils');

const getAllUsers = async response => {
  const User = await require('../models/user');
  const userdata = await User.find();
  responseUtils.sendJson(response,userdata);
};

/**
 * Delete user and send deleted user as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 */
const deleteUser = async (response, userId, currentUser) => {
  // TODO: 10.1 Implement this
  throw new Error('Not Implemented');
};

/**
 * Update user and send updated user as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 * @param {Object} userData JSON data from request body
 */
const updateUser = async (response, userId, currentUser, userData) => {
  const userdata = await require('../models/user').find();
  console.log(userId+" "+ currentUser._id);
  //TODO: 10.1 this is harder than I thought :> 

};

/**
 * Send user data as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 */
const viewUser = async (response, userId, currentUser) => {
  // console.log(currentUser.id+" " +userId);
  // Test fails (the printout ):>>>>
  if (userId !== currentUser.id)
  {
    responseUtils.notFound(response);
  }
  else
  {
    responseUtils.sendJson(response, currentUser);
  }
};

/**
 * Register new user and send created user back as JSON
 *
 * @param {http.ServerResponse} response
 * @param {Object} userData JSON data from request body
 */
const registerUser = async (response, userData) => {
  // TODO: 10.1 Implement this
  throw new Error('Not Implemented');
};

module.exports = { getAllUsers, registerUser, deleteUser, viewUser, updateUser };
