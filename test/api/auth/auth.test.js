const { clean } = require('../../../models/seeds/clean');
const { seeds } = require('../../../models/seeds/seeds');
const codes = require('../../../config/codes');

const models = require('../../../models');

const { User, Verification } = models;

describe('Auth', () => {
  const apiUrl = '/api/v1';

  beforeEach(async () => {
    await seeds();
  });

  afterEach(async () => {
    await clean();
  });
  // ----------------------------------------
  // Login Route
  // ----------------------------------------
  describe('Login Route', () => {
    it('Login a user via /auth/login', async () => {
      const [name, email, password] = [
        'Duke Nukem',
        'ahmed@fituri.ly',
        'F@m1lyGuy'
      ];
      const userObj = new User({
        name,
        email,
        password,
        isActive: true
      });
      await userObj.save();

      const response = await global.agent
        .post(`${apiUrl}/auth/login`)
        .send({
          email,
          password
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { user, token } = body;
      expect(statusCode).toBe(200);
      expect(user.name).toBe(name);
      expect(user.email).toBe(email);
      expect(user.password).toBeUndefined();
      expect(token).toBeDefined();
    });

    it('Returns an error when an email is missing', async () => {
      const response = await global.agent
        .post(`${apiUrl}/auth/login`)
        .send({
          password: 'iamthefrogman'
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.missingEmail.status);
      expect(code).toBe(codes.missingEmail.code);
      expect(messageEn).toBe(codes.missingEmail.messageEn);
      expect(messageAr).toBe(codes.missingEmail.messageAr);
    });

    it('Returns an error when an email is invalid', async () => {
      const response = await global.agent
        .post(`${apiUrl}/auth/login`)
        .send({
          email: 'notValidEmail'
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.invalidEmail.status);
      expect(code).toBe(codes.invalidEmail.code);
      expect(messageEn).toBe(codes.invalidEmail.messageEn);
      expect(messageAr).toBe(codes.invalidEmail.messageAr);
    });

    it('Returns an error when a password is missing', async () => {
      const response = await global.agent
        .post(`${apiUrl}/auth/login`)
        .send({
          email: 'erlich.bachman@pidepipder.com'
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.missingPassword.status);
      expect(code).toBe(codes.missingPassword.code);
      expect(messageEn).toBe(codes.missingPassword.messageEn);
      expect(messageAr).toBe(codes.missingPassword.messageAr);
    });
  });
  // ----------------------------------------
  // Register Route
  // ----------------------------------------
  describe('Register Route', () => {
    it('Registers a new user via /auth/register', async () => {
      const response = await global.agent
        .post(`${apiUrl}/auth/register`)
        .send({
          email: 'erlich.bachman@pidepipder.com',
          password: 'iamthefrogman',
          phone: '12238383838',
          name: 'Erlich Bachman',
          locale: 'EN'
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { id, email, password, phone, name, locale } = body.user;
      expect(statusCode).toBe(codes.userCreated.status);
      expect(email).toBe('erlich.bachman@pidepipder.com');
      expect(password).toBeUndefined();
      expect(name).toBe('Erlich Bachman');
      expect(phone).toBe('12238383838');
      expect(locale).toBe('EN');
      const verification = await Verification.findOne({ userId: id });
      expect(verification.pin).toBeDefined();
    });

    it('Returns an error when an email is missing', async () => {
      const response = await global.agent
        .post(`${apiUrl}/auth/register`)
        .send({
          password: 'iamthefrogman',
          phone: '12238383838',
          name: 'Erlich Bachman',
          locale: 'EN'
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.missingEmail.status);
      expect(code).toBe(codes.missingEmail.code);
      expect(messageEn).toBe(codes.missingEmail.messageEn);
      expect(messageAr).toBe(codes.missingEmail.messageAr);
    });

    it('Returns an error when an email is invalid', async () => {
      const response = await global.agent
        .post(`${apiUrl}/auth/register`)
        .send({
          email: 'notValidEmail',
          password: 'iamthefrogman',
          phone: '12238383838',
          name: 'Erlich Bachman',
          locale: 'EN'
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.invalidEmail.status);
      expect(code).toBe(codes.invalidEmail.code);
      expect(messageEn).toBe(codes.invalidEmail.messageEn);
      expect(messageAr).toBe(codes.invalidEmail.messageAr);
    });

    it('Returns an error when a password is missing', async () => {
      const response = await global.agent
        .post(`${apiUrl}/auth/register`)
        .send({
          email: 'erlich.bachman@pidepipder.com',
          phone: '12238383838',
          name: 'Erlich Bachman',
          locale: 'EN'
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.missingPassword.status);
      expect(code).toBe(codes.missingPassword.code);
      expect(messageEn).toBe(codes.missingPassword.messageEn);
      expect(messageAr).toBe(codes.missingPassword.messageAr);
    });

    it('Returns an error when a password is invalid', async () => {
      const response = await global.agent
        .post(`${apiUrl}/auth/register`)
        .send({
          email: 'erlich.bachman@pidepipder.com',
          password: 'short',
          phone: '12238383838',
          name: 'Erlich Bachman',
          locale: 'EN'
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.invalidPassword.status);
      expect(code).toBe(codes.invalidPassword.code);
      expect(messageEn).toBe(codes.invalidPassword.messageEn);
      expect(messageAr).toBe(codes.invalidPassword.messageAr);
    });

    it('Returns an error when an email exists', async () => {
      const user = new User({
        email: 'erlich.bachman@pidepipder.com',
        password: 'iamthefrogman',
        phone: '12238383838',
        name: 'Erlich Bachman',
        locale: 'EN'
      });
      await user.save();
      const response = await global.agent
        .post(`${apiUrl}/auth/register`)
        .send({
          email: 'erlich.bachman@pidepipder.com',
          password: 'iamthefrogman',
          phone: '12238383838',
          name: 'Erlich Bachman',
          locale: 'EN'
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.emailExists.status);
      expect(code).toBe(codes.emailExists.code);
      expect(messageEn).toBe(codes.emailExists.messageEn);
      expect(messageAr).toBe(codes.emailExists.messageAr);
    });

    it('Returns an error when passing invalid locale', async () => {
      const response = await global.agent
        .post(`${apiUrl}/auth/register`)
        .send({
          email: 'erlich.bachman@pidepipder.com',
          password: 'iamthefrogman',
          phone: '12238383838',
          name: 'Erlich Bachman',
          locale: 'ES'
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.invalidLocale.status);
      expect(code).toBe(codes.invalidLocale.code);
      expect(messageEn).toBe(codes.invalidLocale.messageEn);
      expect(messageAr).toBe(codes.invalidLocale.messageAr);
    });
  });

  // ----------------------------------------
  // Verify Route
  // ----------------------------------------
  describe('Verify Route', () => {
    it('Verify a user with pin code via POST /api/v1/auth/verify', async () => {
      const user = await User.findOne({ isActive: false });
      const verification = new Verification({
        userId: user.id,
        pin: 123456
      });
      await verification.save();
      const response = await global.agent
        .post(`${apiUrl}/auth/verify`)
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

    it('Fails to verify when a pin is missing via POST /api/v1/auth/verify', async () => {
      const user = await User.findOne({ isActive: false });
      const response = await global.agent
        .post(`${apiUrl}/auth/verify`)
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

    it('Fails to verify when a userId is missing via POST /api/v1/auth/verify', async () => {
      const response = await global.agent
        .post(`${apiUrl}/auth/verify`)
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

    it('Fails to verify when an invalid userId is provided via POST /api/v1/auth/verify', async () => {
      const response = await global.agent
        .post(`${apiUrl}/auth/verify`)
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

    it('Fails to verify a not found user code via POST /api/v1/auth/verify', async () => {
      const response = await global.agent
        .post(`${apiUrl}/auth/verify`)
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

    it('Fails to verify an already active user via POST /api/v1/auth/verify', async () => {
      const user = await User.findOne({ isActive: true });
      const response = await global.agent
        .post(`${apiUrl}/auth/verify`)
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

    it('Fails to verify with an expired pin via POST /api/v1/auth/verify', async () => {
      const user = await User.findOne({ isActive: false });
      const response = await global.agent
        .post(`${apiUrl}/auth/verify`)
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

    it('Fails to verify with a wrong pin via POST /api/v1/auth/verify', async () => {
      const user = await User.findOne({ isActive: false });
      const verification = new Verification({
        userId: user.id,
        pin: 123456
      });
      await verification.save();
      const response = await global.agent
        .post(`${apiUrl}/auth/verify`)
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
  });

  // ----------------------------------------
  // Resend Route
  // ----------------------------------------
  describe('Resend PIN Route', () => {
    it('Resend a verification pin via POST /api/v1/auth/resend', async () => {
      const user = await User.findOne({ isActive: false });
      const response = await global.agent
        .post(`${apiUrl}/auth/resend`)
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

    it('Fails to resend a pin to an already active user via POST /api/v1/auth/resend', async () => {
      const user = await User.findOne({ isActive: true });
      const response = await global.agent
        .post(`${apiUrl}/auth/resend`)
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

    it('Fails to resend a pin to a non user via POST /api/v1/auth/resend', async () => {
      const response = await global.agent
        .post(`${apiUrl}/auth/resend`)
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

    it('Fails to resend a pin when a userId is missing via POST /api/v1/auth/resend', async () => {
      const response = await global.agent
        .post(`${apiUrl}/auth/resend`)
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
