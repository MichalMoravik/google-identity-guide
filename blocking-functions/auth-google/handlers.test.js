import { beforeSignInHandler } from './handlers.js';

describe('beforeSignInHandler', () => {
  it.each([
    ['z@gmail.com'],
    ['x@apple.com'],
  ])('Should return role: "user"', email => {
    const user = { email };
    const adminEmails = ['x@gmail.com'];

    const result = beforeSignInHandler(user, {}, adminEmails);

    expect(result).toEqual({
      customClaims: {
        role: 'user',
      },
    });
  });

  it('Should return role: "admin"', () => {
    const user = { email: 'x@gmail.com' };
    const adminEmails = ['x@gmail.com'];

    const result = beforeSignInHandler(user, {}, adminEmails);

    expect(result).toEqual({
      customClaims: {
        role: 'admin',
      },
    });
  });

  it('Should return role: "user" as adminEmails is empty', () => {
    const user = { email: 'x@gmail.com' };
    const adminEmails = [];

    const result = beforeSignInHandler(user, {}, adminEmails);

    expect(result).toEqual({
      customClaims: {
        role: 'user',
      },
    });
  });
});
