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
  const User = await require('../models/user');
  const fUser = await User.findById(userId).exec();
  if (! fUser){
    return responseUtils.notFound(response);
  }
  if (userId === currentUser.id){
    return responseUtils.badRequest(response, "Bad request");
  }
  await User.deleteOne({_id: userId}).then(()=> 
    responseUtils.sendJson(response, fUser));
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
  if (userId === currentUser.id){
    return responseUtils.badRequest(response,"Updating own data is not allowed");
  }
  if (!userData.role){
    return responseUtils.badRequest(response,"Missing role");
  }
  if (userData.role !== 'customer' && userData.role !== "admin"){
    return responseUtils.badRequest(response,"Invalid role");
  }
  const User = await require('../models/user');
  const fUser = await User.findById(userId).exec();
  if (!fUser){
    return responseUtils.notFound(response);
  }
  fUser.role = userData.role;
  await fUser.save();
  return responseUtils.sendJson(response, fUser);
};

/**
 * Send user data as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 */
const viewUser = async (response, userId, currentUser) => {
  const User = await require('../models/user');
  const vUser = await User.findById(userId).exec();
  if (! vUser)
  {
    return responseUtils.notFound(response);
  }
  else
  {
    return responseUtils.sendJson(response, vUser);
  }
};

/**
 * Register new user and send created user back as JSON
 *
 * @param {http.ServerResponse} response
 * @param {Object} userData JSON data from request body
 */
const registerUser = async (response, userData) => {
  const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const regex = new RegExp(pattern);
  if (!regex.test(userData.email))
  {
    return responseUtils.badRequest(response,"Email not valid");
  }
  const User = await require('../models/user');
  const fUser = await User.findOne({email: userData.email}).exec();
  if (fUser){
    return responseUtils.badRequest(response,"Email is already in use");
  }
  if (!userData.name){
    return responseUtils.badRequest(response,"Name is missing");
  }

  if (!userData.password){
    return responseUtils.badRequest(response,"Password is missing");
  }
  if (userData.password.length <10){
    return responseUtils.badRequest(response,"Password is too short");
  }
  userData.role = "customer";
  const newUser = new User(userData)
  await newUser.save().then( ()=> responseUtils.createdResource(response,newUser));
};

module.exports = { getAllUsers, registerUser, deleteUser, viewUser, updateUser };
