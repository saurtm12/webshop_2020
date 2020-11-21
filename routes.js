const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson, getCredentials} = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
const { emailInUse, saveNewUser, validateUser, generateId, getUser, getUserById, updateUserRole, deleteUserById } = require('./utils/users');
const fs = require('fs');
const { sendJson, basicAuthChallenge} = require('./utils/responseUtils');
const { userInfo } = require('os');
const { parse } = require('path');
const { getCurrentUser } = require('./auth/auth');
const { getAllProducts } = require('./controllers/products');
const userController = require('./controllers/users')
const User = require('./models/user');
/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET'],
  '/api/products': ['GET']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response
 */
const sendOptions = (filePath, response) => {
  if (filePath in allowedMethods) {
    response.writeHead(204, {
      'Access-Control-Allow-Methods': allowedMethods[filePath].join(','),
      'Access-Control-Allow-Headers': 'Content-Type,Accept',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Expose-Headers': 'Content-Type,Accept'
    });
    return response.end();
  }

  return responseUtils.notFound(response);
};

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath
 * @param {string} prefix
 * @returns {boolean}
 */
const matchIdRoute = (url, prefix) => {
  const idPattern = '[0-9a-z]{8,24}';
  const regex = new RegExp(`^(/api)?/${prefix}/${idPattern}$`);
  return regex.test(url);
};

/**
 * Does the URL match /api/users/{id}
 *
 * @param {string} url filePath
 * @returns {boolean}
 */
const matchUserId = url => {
  return matchIdRoute(url, 'users');
};

const handleRequest = async (request, response) => {
  const { url, method, headers } = request;
  const filePath = new URL(url, `http://${headers.host}`).pathname;

  // serve static files from public/ and return immediately
  if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
    const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
    return renderPublic(fileName, response);
  }

  if (matchUserId(filePath)) {
    // TODO: 8.5 Implement view, update and delete a single user by ID (GET, PUT, DELETE)
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    const authorization = headers.authorization;
    const credential = getCredentials(request);
    const id = filePath.split('/')[3];
    if (credential !== null) {
      const authorizedUser = await getCurrentUser(request);
      if (authorizedUser === null) {
        basicAuthChallenge(response);
      } else if (authorizedUser['role'] !== 'admin') {
        response.writeHead(403, {'WWW-Authenticate' : 'Basic'});
        response.end();
      } else {
        if (method.toUpperCase() === 'GET') {
          return userController.viewUser(response,id);
        }
        
        if (method.toUpperCase() === 'PUT') {
          const jsonData = await parseBodyJson(request);
          const currentUser = getCurrentUser(request);
          return userController.updateUser(response, id, currentUser, jsonData)
        }
        if (method.toUpperCase() === 'DELETE') {          
          const currentUser = getCurrentUser(request);
          return userController.deleteUser(response, id, currentUser);
        }
      }
    } else {
      basicAuthChallenge(response);
    }
  }

  // Default to 404 Not Found if unknown url
  if (!(filePath in allowedMethods)) return responseUtils.notFound(response);

  // See: http://restcookbook.com/HTTP%20Methods/options/
  if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

  // Check for allowable methods
  if (!allowedMethods[filePath].includes(method.toUpperCase())) {
    return responseUtils.methodNotAllowed(response);
  }

  // Require a correct accept header (require 'application/json' or '*/*')
  if (!acceptsJson(request)) {
    return responseUtils.contentTypeNotAcceptable(response);
  }

  

  if (filePath === '/api/products' && method.toUpperCase() === 'GET') {
    if(!request.headers.authorization) {
      return responseUtils.basicAuthChallenge(response);
    }
    if(await getCurrentUser(request) === null) {
      return responseUtils.basicAuthChallenge(response);
    }
    return getAllProducts(response);
  }


  // GET all users
  if (filePath === '/api/users' && method.toUpperCase() === 'GET') {
    // TODO: 8.3 Return all users as JSON
    if(!request.headers.authorization) {
      return responseUtils.basicAuthChallenge(response);
    }
    const authHeadersArray = request.headers.authorization.split(" ");
    if(Buffer.from(authHeadersArray[1], 'base64').toString('base64') !== authHeadersArray[1]) {
      return responseUtils.basicAuthChallenge(response);
    }
    const current = await getCurrentUser(request);
    if(current === null) {
      return responseUtils.basicAuthChallenge(response);
    }
    if (current.role === 'customer') {
      return responseUtils.forbidden(response);
    }
    return userController.getAllUsers(response);
    // // const allUsers = await User.find().exec();
    // return responseUtils.sendJson(response, {}, 200);
  }

  // register new user
  if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
    // Fail if not a JSON request
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }

    // TODO: 8.3 Implement registration
    const userData = await parseBodyJson(request);
    return userController.registerUser(response, userData);
  }
};

module.exports = { handleRequest };
