const request = require('supertest');
const mongoose = require('mongoose');
const mongo = require('../utils/mongo');
const app = require('../server');

process.env.NODE_ENV = 'test';

let server;

beforeAll(async () => {
  const port = 8888;
  server = app.listen(port);
  global.agent = request.agent(server);
  if (!mongoose.connection.readyState) {
    await mongo();
  }
});
afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
});
