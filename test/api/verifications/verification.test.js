const { clean } = require('../../../models/seeds/clean');
const { seeds } = require('../../../models/seeds/seeds');
const codes = require('../../../config/codes');

const models = require('../../../models');

const { User, Verification } = models;

describe('Verification', () => {
  const apiUrl = '/api/v1';

  beforeEach(async () => {
    await seeds();
  });

  afterEach(async () => {
    await clean();
  });
  // ----------------------------------------
  // Verification Routes
  // ----------------------------------------
  describe('Verification Routes', () => {
    it('Verify a user with pin code via POST /api/v1/verifications', async () => {
      const user = await User.findOne({ isActive: false });
      const verification = new Verification({
        userId: user.id,
        pin: 123456
      });
      await verification.save();
      const response = await global.agent
        .post(`${apiUrl}/verifications`)
        .send({
          userId: user.id,
          pin: verification.pin
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      expect(statusCode).toBe(codes.userVerified.status);
      expect(body.info.code).toBe(codes.userVerified.code);
      const verifiedUser = await User.findById(user.id);
      expect(verifiedUser.isActive).toBe(true);
    });

    it('Fails to verify when a pin is missing via POST /api/v1/verifications', async () => {
      const user = await User.findOne({ isActive: false });
      const response = await global.agent
        .post(`${apiUrl}/verifications`)
        .send({
          userId: user.id
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.missingPin.status);
      expect(code).toBe(codes.missingPin.code);
      expect(messageEn).toBe(codes.missingPin.messageEn);
      expect(messageAr).toBe(codes.missingPin.messageAr);
    });

    it('Fails to verify when a userId is missing via POST /api/v1/verifications', async () => {
      const response = await global.agent
        .post(`${apiUrl}/verifications`)
        .send({
          pin: 123456
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.missingUserId.status);
      expect(code).toBe(codes.missingUserId.code);
      expect(messageEn).toBe(codes.missingUserId.messageEn);
      expect(messageAr).toBe(codes.missingUserId.messageAr);
    });

    it('Fails to verify when an invalid userId is provided via POST /api/v1/verifications', async () => {
      const response = await global.agent
        .post(`${apiUrl}/verifications`)
        .send({
          pin: 123456,
          userId: 'invalidUserId'
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.invalidId.status);
      expect(code).toBe(codes.invalidId.code);
      expect(messageEn).toBe(codes.invalidId.messageEn);
      expect(messageAr).toBe(codes.invalidId.messageAr);
    });

    it('Fails to verify a not found user code via POST /api/v1/verifications', async () => {
      const response = await global.agent
        .post(`${apiUrl}/verifications`)
        .send({
          userId: '5dcc647972a4abf6dc6dbbde', // This is a fake userId
          pin: 123456
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.userNotFound.status);
      expect(code).toBe(codes.userNotFound.code);
      expect(messageEn).toBe(codes.userNotFound.messageEn);
      expect(messageAr).toBe(codes.userNotFound.messageAr);
    });

    it('Fails to verify an already active user via POST /api/v1/verifications', async () => {
      const user = await User.findOne({ isActive: true });
      const response = await global.agent
        .post(`${apiUrl}/verifications`)
        .send({
          userId: user.id,
          pin: 123456
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.alreadyVerified.status);
      expect(code).toBe(codes.alreadyVerified.code);
      expect(messageEn).toBe(codes.alreadyVerified.messageEn);
      expect(messageAr).toBe(codes.alreadyVerified.messageAr);
    });

    it('Fails to verify with an expired pin via POST /api/v1/verifications', async () => {
      const user = await User.findOne({ isActive: false });
      const response = await global.agent
        .post(`${apiUrl}/verifications`)
        .send({
          userId: user.id,
          pin: 123456
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.expiredPin.status);
      expect(code).toBe(codes.expiredPin.code);
      expect(messageEn).toBe(codes.expiredPin.messageEn);
      expect(messageAr).toBe(codes.expiredPin.messageAr);
    });

    it('Fails to verify with a wrong pin via POST /api/v1/verifications', async () => {
      const user = await User.findOne({ isActive: false });
      const verification = new Verification({
        userId: user.id,
        pin: 123456
      });
      await verification.save();
      const response = await global.agent
        .post(`${apiUrl}/verifications`)
        .send({
          userId: user.id,
          pin: 654321
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.wrongPin.status);
      expect(code).toBe(codes.wrongPin.code);
      expect(messageEn).toBe(codes.wrongPin.messageEn);
      expect(messageAr).toBe(codes.wrongPin.messageAr);
    });

    it('Resend a verification pin via POST /api/v1/verifications/resend', async () => {
      const user = await User.findOne({ isActive: false });
      const response = await global.agent
        .post(`${apiUrl}/verifications/resend`)
        .send({
          userId: user.id
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      expect(statusCode).toBe(codes.pinResent.status);
      expect(body.info.code).toBe(codes.pinResent.code);
      const verification = await Verification.findOne({ userId: user.id });
      expect(verification).toBeDefined();
    });

    it('Fails to resend a pin to an already active user via POST /api/v1/verifications/resend', async () => {
      const user = await User.findOne({ isActive: true });
      const response = await global.agent
        .post(`${apiUrl}/verifications/resend`)
        .send({
          userId: user.id
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.alreadyVerified.status);
      expect(code).toBe(codes.alreadyVerified.code);
      expect(messageEn).toBe(codes.alreadyVerified.messageEn);
      expect(messageAr).toBe(codes.alreadyVerified.messageAr);
    });

    it('Fails to resend a pin to a non user via POST /api/v1/verifications/resend', async () => {
      const response = await global.agent
        .post(`${apiUrl}/verifications/resend`)
        .send({
          userId: '5dcc647972a4abf6dc6dbbde' // This is a fake userId
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.userNotFound.status);
      expect(code).toBe(codes.userNotFound.code);
      expect(messageEn).toBe(codes.userNotFound.messageEn);
      expect(messageAr).toBe(codes.userNotFound.messageAr);
    });

    it('Fails to resend a pin when a userId is missing via POST /api/v1/verifications/resend', async () => {
      const response = await global.agent
        .post(`${apiUrl}/verifications/resend`)
        .send({
          pin: 123456
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.missingUserId.status);
      expect(code).toBe(codes.missingUserId.code);
      expect(messageEn).toBe(codes.missingUserId.messageEn);
      expect(messageAr).toBe(codes.missingUserId.messageAr);
    });
  });
});
