import request from 'supertest';
import express from 'express';
import { useAuthZ } from './authz.js';

const app = express();

describe('useAuthZ', () => {
  describe('Tests different user role values', () => {
    let user = {
      uid: 'UID123',
      email: 'x@gmail.com',
      role: '',
    };

    beforeEach(() => {
      app.use((req, res, next) => {
        res.locals = { user };
        next();
      });
    });

    const testCases = [
      {
        testName: 'Should succeed as user role is admin',
        role: 'admin',
        requiredRole: 'admin',
        expected: 200,
      },
      {
        testName: 'Should fail as user role is user but required role is admin',
        role: 'user',
        requiredRole: 'admin',
        expected: 403,
      },
      {
        testName: 'Should fail as user role is empty string',
        role: '',
        requiredRole: 'admin',
        expected: 401,
      },
      {
        testName: 'Should fail as user is not set',
        requiredRole : 'admin',
        expected: 401,
      },
    ];

    it.each(testCases)('%s', async (testCase) => {
      const { role, requiredRole, expected } = testCase;
      user.role = role;

      app.get('/', useAuthZ(requiredRole), (req, res) => {
        res.send('Success');
      });

      const response = await request(app).get('/');
      expect(response.statusCode).toBe(expected);
    });
  });

  it('Should fail as user is not present in context', async () => {
    app.get('/', useAuthZ('admin'), (req, res) => {
      res.send('Success');
    });

    const response = await request(app).get('/');
    expect(response.statusCode).toBe(401);
  });
});
