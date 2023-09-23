// Import the module you want to test
const basicAuth = require('../../src/auth/basic-auth'); // Adjust the import path as needed

describe('Basic Authentication Module', () => {
  describe('strategy', () => {
    test('should return a configured strategy when HTPASSWD_FILE is defined', () => {
      // Set a value for HTPASSWD_FILE to simulate a defined environment variable
      process.env.HTPASSWD_FILE = "/Users/nonthachaiplodthong/Documents/Non's work/ccp/fragments/env.jest";

      // Call the strategy function and expect it to return a strategy
      const strategy = basicAuth.strategy();

      // You can further assert properties of the strategy if needed
      expect(strategy).toBeDefined();
      // Add more assertions as needed
    });
  });

  describe('authenticate', () => {
    it('should return a Passport authentication middleware', () => {
      // Call the authenticate function and expect it to return a middleware
      const middleware = basicAuth.authenticate();

      // You can further assert properties of the middleware if needed
      expect(middleware).toBeDefined();
      // Add more assertions as needed
    });
  });
});
