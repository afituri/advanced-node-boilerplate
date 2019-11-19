const { clean } = require('../../../models/seeds/clean');
const { seeds } = require('../../../models/seeds/seeds');

const models = require('../../../models');

const { Verification } = models;

describe('Verification', () => {
  const apiUrl = '/api/v1';

  beforeEach(async () => {
    await seeds();
  });

  afterEach(async () => {
    await clean();
  });

  // ----------------------------------------
  // Verification
  // ----------------------------------------
  describe('Verification schema', () => {
    it('Makes sure pin gets deleted.', async () => {
      const response = await global.agent
        .post(`${apiUrl}/users`)
        .send({
          email: 'ahmed.fituri@gmail.com',
          password: 'iamthefrogman',
          phone: '12238383838',
          name: 'Erlich Bachman',
          locale: 'EN'
        })
        .set('Accept', 'application/json');
      const { body } = response;
      const { id } = body.user;
      let verification = await Verification.findOne({ userId: id });
      expect(verification.pin).toBeDefined();
      verification.expireAt = '2019-11-17T18:16:20.610Z';
      await verification.save();
      verification = await Verification.findOne({ userId: id });
      expect(verification).toBeDefined();
    });
  });
});
