const mongoose = require('mongoose');

beforeAll(async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Not in test environment! Set NODE_ENV=test');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to test database');
});

/**
 * Clean up database after EACH test
 * This ensures tests don't affect each other
 */
afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

/**
 * Disconnect after ALL tests are done
 */
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  console.log('✅ Disconnected from test database');
});