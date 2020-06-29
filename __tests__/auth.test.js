const { agent } = require('../db/data-helpers.js');
const User = require('../lib/models/User');
const request = require('supertest');
const app = require('../lib/app');

describe('auth routes', () => {
  it('can create a new user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'person1',
        profilePhotoUrl: 'www.something.com',
        password: 'supersecret'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          username: 'person1',
          profilePhotoUrl: 'www.something.com',
        });
      });
  });
  it('login user', () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'user0',
        password: 'password0'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          username: 'user0',
          profilePhotoUrl: expect.any(String)
        });
      });
  });

  it('can verify authentication', () => {
    return agent
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          username: 'user0',
          profilePhotoUrl: expect.any(String)
        });
      });
  });
});
