const request = require('supertest');
const app = require('../app');

/**
 * Helper function to create a user and get JWT token
 * Used in tests that need authentication
 */
async function createUserAndGetToken(email = 'test@example.com', password = 'Password123!') {
  const signupResponse = await request(app)
    .post('/api/user/signup')
    .send({ email, password });

  const token = signupResponse.body.token;

  return { token, email, password };
}

/**
 * Helper function to login and get token
 */
async function loginAndGetToken(email, password) {
  const response = await request(app)
    .post('/api/user/login')
    .send({ email, password });

  return response.body.token;
}

module.exports = {
  createUserAndGetToken,
  loginAndGetToken
};