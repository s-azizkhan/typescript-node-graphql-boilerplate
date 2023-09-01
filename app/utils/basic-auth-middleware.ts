import basicAuth from 'express-basic-auth';
import { configData } from '../config/config';
import { RequestHandler } from 'express';

/**
 * Authenticates a user using basic authorization.
 *
 * @param {string} username - The username provided by the user.
 * @param {string} password - The password provided by the user.
 * @param {function} cb - The callback function to be called after authentication.
 * @return {void} This function does not return a value.
 */
const basicAuthorizer = async (username: string, password: string, cb: (err: Error | null, authenticated: boolean) => void) => {
  const userMatches = basicAuth.safeCompare(username, configData.BASIC_AUTH_USERNAME);
  const passwordMatches = basicAuth.safeCompare(password, configData.BASIC_AUTH_PASSWORD);

  const result = userMatches && passwordMatches;
  if (result) {
    return cb(null, true);
  }

  return cb(null, false);
};


// Middleware to implement basic authentication
const basicAuthMiddleware: RequestHandler = basicAuth({
  authorizer: basicAuthorizer,
  authorizeAsync: true,
  challenge: true,
});

export default basicAuthMiddleware;