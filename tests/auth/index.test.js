const originalProcessEnv = { ...process.env };

describe('auth', () => {
  // Reset the env vars before each test.
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalProcessEnv };
  });
  afterAll(() => {
    process.env = originalProcessEnv;
  });

  test('Load HTPASSWD', () => {
    process.env.HTPASSWD_FILE = 'some_file_path';
    process.env.NODE_ENV = 'development';
    jest.mock('./../../src/auth/basic-auth', () => ({}));
    const auth = require('./../../src/auth/index');
    expect(auth).toBeDefined();
    expect(jest.requireActual('../../src/auth/basic-auth')).toBeDefined();
  });

  test('throws an error when no valid config is found', () => {
    // delete all the env vars
    
    delete process.env.AWS_COGNITO_POOL_ID;
    delete process.env.AWS_COGNITO_CLIENT_ID;
    delete process.env.HTPASSWD_FILE;

    expect(() => {
      require('../../src/auth/index');
    }).toThrow('missing env vars: no authorization configuration found');
  });
});
