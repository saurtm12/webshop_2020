const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson, getCredentials} = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
const fs = require('fs');
const { sendJson, basicAuthChallenge} = require('./utils/responseUtils');
const { getCurrentUser } = require('./auth/auth');
const { getAllProducts, registerProduct, viewProduct, deleteProduct, updateProduct } = require('./controllers/products');
const userController = require('./controllers/users');
const orderController = require('./controllers/orders');
/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET'],
  '/api/products': ['GET', 'POST', 'PUT', 'DELETE'],
  '/api/orders': ['GET', 'POST']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {object} response http.ServerResponse
 * @returns {object} response
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
};

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath
 * @param {string} prefix The part after /api/ , for example /api/users/
 * @returns {boolean} True if matches, false if not
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
 * @returns {boolean} true if matches, false if not
 */
const matchUserId = url => {
  return matchIdRoute(url, 'users');
};

const matchProductId = url => {
  return matchIdRoute(url, 'products');
};

const matchOrderId = url => {
  return matchIdRoute(url, 'orders');
};

const handleRequest = async (request, response) => {
  const { url, method, headers } = request;
  const filePath = new URL(url, `http://${headers.host}`).pathname;

  // serve static files from public/ and return immediately
  if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
    const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
    return renderPublic(fileName, response);
  }

  if (matchOrderId(filePath)) {
    const credential = getCredentials(request);
    const orderId = filePath.split('/')[3];
    if (credential !== null) {
      const authorizedUser = await getCurrentUser(request);
      if (authorizedUser === null) {
        return basicAuthChallenge(response);
      }
      if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
      }
      if (method.toUpperCase() === 'GET') {
        if(authorizedUser.role === 'admin') {
          return await orderController.viewOrder(response, orderId);
        }
        return await orderController.viewOrderByCustomer(response, orderId, authorizedUser._id);
      }
    } else {
      basicAuthChallenge(response);
    }
  }

  if (matchProductId(filePath)) {
    const credential = getCredentials(request);
    const productId = filePath.split('/')[3];
    if (credential !== null) {
      const authorizedUser = await getCurrentUser(request);
      if (authorizedUser === null) {
        return basicAuthChallenge(response);
      }
      if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
      }
      if (method.toUpperCase() === 'GET') {
        return await viewProduct(response, productId);
      }
      if (method.toUpperCase() === 'PUT') {
        if (authorizedUser.role === 'customer') {
          return responseUtils.forbidden(response);
        }
        const body = await parseBodyJson(request);
        return await updateProduct(response, productId, body);
      }
      if (method.toUpperCase() === 'DELETE') {
        if (authorizedUser.role === 'customer') {
          return responseUtils.forbidden(response);
        }
        return deleteProduct(response, productId);
      }
    } else {
      basicAuthChallenge(response);
    }
  }

  if (matchUserId(filePath)) {
    // TODO: 8.5 Implement view, update and delete a single user by ID (GET, PUT, DELETE)
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
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
          if (!acceptsJson(request)) {
            return responseUtils.contentTypeNotAcceptable(response);
          }
          return userController.viewUser(response, id);
        }
        
        if (method.toUpperCase() === 'PUT') {
          if (!acceptsJson(request)) {
            return responseUtils.contentTypeNotAcceptable(response);
          }
          const jsonData = await parseBodyJson(request);
          const currentUser = getCurrentUser(request);
          return userController.updateUser(response, id, currentUser, jsonData);
        }
        if (method.toUpperCase() === 'DELETE') { 
          if (!acceptsJson(request)) {
            return responseUtils.contentTypeNotAcceptable(response);
          }         
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

  if (filePath === '/api/products' && method.toUpperCase() === 'POST') {
    if(!request.headers.authorization) {
      return responseUtils.basicAuthChallenge(response);
    }
    const current = await getCurrentUser(request);
    if(current === null) {
      return responseUtils.basicAuthChallenge(response);
    }
    if (current.role === 'customer') {
      return responseUtils.forbidden(response);
    }
    if(!isJson(request)) {
      return responseUtils.badRequest(response, "Invalid json");
    }
    const productData = await parseBodyJson(request);
    return await registerProduct(response, productData);
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

  if (filePath === '/api/orders' && method.toUpperCase() === 'GET') {
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

    if(current.role === 'customer') {
      return orderController.viewOrdersByCustomer(response, current._id );
    }
    return orderController.getAllOrders(response);
  }
  if (filePath === '/api/orders' && method.toUpperCase() === 'POST') {
    if(!request.headers.authorization) {
      return responseUtils.basicAuthChallenge(response);
    }
    const current = await getCurrentUser(request);
    if(current === null) {
      return responseUtils.basicAuthChallenge(response);
    }
    if (current.role === 'admin') {
      return responseUtils.forbidden(response);
    }
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    const body = await parseBodyJson(request);
    return await orderController.registerOrder(response, body);
  }
};

module.exports = { handleRequest };
