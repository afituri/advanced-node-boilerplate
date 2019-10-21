const request = require('supertest');
const mongoose = require('mongoose');
const mongo = require('../../../utils/mongo');
const cleanDB = require('../../../models/seeds/clean');
const codes = require('../../../config/codes');

const app = require('../../../server');
const models = require('../../../models');

process.env.NODE_ENV = 'test';
const { User } = models;

describe('User', () => {
  const apiUrl = '/api/v1';
  const port = 8888;
  let server;

  beforeEach(async () => {
    server = await app.listen(port);
    global.agent = request.agent(server);
    if (!mongoose.connection.readyState) {
      mongo();
    }
  });

  afterEach(async () => {
    await server.close();
    await cleanDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  // ----------------------------------------
  // User Routes
  // ----------------------------------------
  describe('User Routes', () => {
    it('Adds a new user when they register', async () => {
      const response = await global.agent
        .post(`${apiUrl}/users`)
        .send({
          email: 'erlich.bachman@pidepiper.com',
          password: 'iamthefrogman',
          phone: '12238383838',
          name: 'Erlich Bachman',
          locale: 'en'
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { email, password, phone, name, locale } = body.user;
      expect(statusCode).toBe(codes.userCreated.status);
      expect(email).toBe('erlich.bachman@pidepiper.com');
      expect(password).toBeUndefined();
      expect(name).toBe('Erlich Bachman');
      expect(phone).toBe('12238383838');
      expect(locale).toBe('en');
    });

    it('Returns an error when an email is missing', async () => {
      const response = await global.agent
        .post(`${apiUrl}/users`)
        .send({
          password: 'iamthefrogman',
          phone: '12238383838',
          name: 'Erlich Bachman',
          locale: 'en'
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
          email: 'notvalidemail',
          password: 'iamthefrogman',
          phone: '12238383838',
          name: 'Erlich Bachman',
          locale: 'en'
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
          email: 'erlich.bachman@pidepiper.com',
          phone: '12238383838',
          name: 'Erlich Bachman',
          locale: 'en'
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
          email: 'erlich.bachman@pidepiper.com',
          password: 'short',
          phone: '12238383838',
          name: 'Erlich Bachman',
          locale: 'en'
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
        email: 'erlich.bachman@pidepiper.com',
        password: 'short',
        phone: '12238383838',
        name: 'Erlich Bachman',
        locale: 'en'
      });
      await user.save();
      const response = await global.agent
        .post(`${apiUrl}/users`)
        .send({
          email: 'erlich.bachman@pidepiper.com',
          password: 'iamthefrogman',
          phone: '12238383838',
          name: 'Erlich Bachman',
          locale: 'en'
        })
        .set('Accept', 'application/json');
      const { statusCode, body } = response;
      const { code, messageEn, messageAr } = body;
      expect(statusCode).toBe(codes.emailExists.status);
      expect(code).toBe(codes.emailExists.code);
      expect(messageEn).toBe(codes.emailExists.messageEn);
      expect(messageAr).toBe(codes.emailExists.messageAr);
    });
  });
});
