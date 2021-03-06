/**
 * Decode, parse and return user credentials (username and password)
 * from the Authorization header.
 *
 * @param {object} request http.incomingMessage
 * @returns {Array|null} [username, password] or null if header is missing
 */
const getCredentials = request => {
  // TODO: 8.4 Parse user credentials from the "Authorization" request header
  // NOTE: The header is base64 encoded as required by the http standard.
  //       You need to first decode the header back to its original form ("email:password").
  //  See: https://attacomsian.com/blog/nodejs-base64-encode-decode
  //       https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/
  
  const authorization = request.headers.authorization;
  if (authorization === undefined || authorization === '' || !authorization.startsWith('Basic'))
  {
    return null;
  } 
  const credentials = Buffer.from(authorization.split(" ")[1], "base64").toString();
  return credentials.split(":");
};

/**
 * Does the client accept JSON responses?
 *
 * @param {object} request http.incomingMessage
 * @returns {boolean} True if client accepts json, otherwise false
 */
const acceptsJson = request => {
  // TODO: 8.3 Check if the client accepts JSON as a response based on "Accept" request header
  // NOTE: "Accept" header format allows several comma separated values simultaneously
  // as in "text/html,application/xhtml+xml,application/json,application/xml;q=0.9,*/*;q=0.8"
  // Do not rely on the header value containing only single content type!
  let acceptsjson = false;
  if(!request.headers.accept){
    return acceptsjson;
  }
  const acceptArray = request.headers.accept.split(',');
  const include = acceptArray.filter(a => a.includes("*/*") || a.includes('application/json'));
  if (include.length > 0){
    acceptsjson = true;
  }

  return acceptsjson;
};

/**
 * Is the client request content type JSON?
 *
 * @param {object} request http.incomingMessage
 * @returns {boolean} If json -> true, else false
 */
const isJson = request => {
  // TODO: 8.3 Check whether request "Content-Type" is JSON or not
  if(request.headers["content-type"] === "application/json") {
    return true;
  }
  return false;
};

/**
 * Asynchronously parse request body to JSON
 *
 * Remember that an async function always returns a Promise which
 * needs to be awaited or handled with then() as in:
 *
 *   const json = await parseBodyJson(request);
 *
 *   -- OR --
 *
 *   parseBodyJson(request).then(json => {
 *     // Do something with the json
 *   })
 *
 * @param {object} request http.IncomingMessage
 * @returns {Promise<*>} Promise resolves to JSON content of the body
 */
const parseBodyJson = request => {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('error', err => reject(err));

    request.on('data', chunk => {
      body += chunk.toString();
    });

    request.on('end', () => {
      resolve(JSON.parse(body));
    });
  });
};

module.exports = { acceptsJson, getCredentials, isJson, parseBodyJson };
