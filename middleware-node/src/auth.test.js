import request from 'supertest';
import express from 'express';
import { useAuth } from './auth.js';

describe('useAuth Middleware', () => {
  const mockAuthClient = {
    verifyIdToken: jest.fn(),
  };

  let app;

  beforeEach(() => {
    app = express();
    app.use(useAuth(mockAuthClient));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should pass auth middleware and set user in locals', async () => {
    const decodedToken = {
      uid: 'UID123',
      email: 'x@gmail.com',
      role: 'admin',
    };

    mockAuthClient.verifyIdToken.mockResolvedValue(decodedToken);

    app.get('/', (req, res) => {
      res.send('Success');
    });

    const response = await request(app)
      .get('/')
      .set('Authorization', 'Bearer token222');

    expect(mockAuthClient.verifyIdToken).toHaveBeenCalledWith('token222');
    expect(response.status).toBe(200);
  });

  it('Should fail as Authorization header is missing', async () => {
    app.get('/', (req, res) => {
      res.send('Success');
    });

    const response = await request(app).get('/');

    expect(mockAuthClient.verifyIdToken).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
  });

  it('Should fails as Authorization header has invalid form', async () => {
    app.get('/', (req, res) => {
      res.send('Success');
    });

    const response = await request(app)
      .get('/')
      .set('Authorization', 'token333');

    expect(mockAuthClient.verifyIdToken).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
  });

  it('Should fail as the token verification failed', async () => {
    mockAuthClient.verifyIdToken.mockRejectedValue(new Error('Invalid token'));

    app.get('/', (req, res) => {
      res.send('Success');
    });

    const response = await request(app)
      .get('/')
      .set('Authorization', 'Bearer token444');

    expect(mockAuthClient.verifyIdToken).toHaveBeenCalledWith('token444');
    expect(response.status).toBe(401);
  });

  it('Should fail as the token does not include "role"', async () => {
    const decodedToken = {
      uid: 'UID123',
      email: 'x@gmail.com',
    };

    mockAuthClient.verifyIdToken.mockResolvedValue(decodedToken);

    app.get('/', (req, res) => {
      res.send('Success');
    });

    const response = await request(app)
      .get('/')
      .set('Authorization', 'Bearer token555');

    expect(mockAuthClient.verifyIdToken).toHaveBeenCalledWith('token555');
    expect(response.status).toBe(401);
  });
});
