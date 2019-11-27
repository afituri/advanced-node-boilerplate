const { clean } = require('../../../models/seeds/clean');
const { seeds } = require('../../../models/seeds/seeds');
const codes = require('../../../config/codes');

const models = require('../../../models');

const { User } = models;

describe('User', () => {
  const apiUrl = '/api/v1';

  beforeEach(async () => {
    await seeds();
    const [name, email, password] = [
      'Duke Nukem',
      'ahmed@fituri.ly',
      'F@m1lyGuy'
    ];
    const user = new User({
      name,
      email,
      password,
      isActive: true
    });
    await user.save();
    const response = await global.agent
      .post(`${apiUrl}/auth/login`)
      .send({
        email,
        password
      })
      .set('Accept', 'application/json');
    const { body } = response;
    const { token } = body;
    global.token = token;
    global.user = user;
  });

  afterEach(async () => {
    await clean();
  });
  // ----------------------------------------
  // User Routes
  // ----------------------------------------
  describe('User Routes', () => {
    it('Retrieve all users', async () => {
      const response = await global.agent
        .get(`${apiUrl}/users`)
        .set('Accept', 'application/json')
        .set({ Authorization: global.token });
      const { statusCode, body } = response;
      const { users } = body;
      expect(statusCode).toBe(codes.ok.status);
      expect(users.length).toBe(10);
    });
  });
});
