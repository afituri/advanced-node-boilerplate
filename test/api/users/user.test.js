const { clean } = require('../../../models/seeds/clean');
const { seeds } = require('../../../models/seeds/seeds');
const codes = require('../../../config/codes');

const models = require('../../../models');

const { User, Verification } = models;

describe('User', () => {
  const apiUrl = '/api/v1';

  beforeEach(async () => {
    await seeds();
  });

  afterEach(async () => {
    await clean();
  });
  // ----------------------------------------
  // User Routes
  // ----------------------------------------
  describe('User Routes', () => {
    it('Adds a new user when they register', async () => {
      const response = await global.agent
        .post(`${apiUrl}/users`)
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
        .post(`${apiUrl}/users`)
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
        .post(`${apiUrl}/users`)
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
        .post(`${apiUrl}/users`)
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
        .post(`${apiUrl}/users`)
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
        .post(`${apiUrl}/users`)
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
        .post(`${apiUrl}/users`)
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
});
