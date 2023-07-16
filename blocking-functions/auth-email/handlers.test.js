import { beforeSignInHandler } from './handlers.js';

describe('beforeSignInHandler', () => {
  it('Should throw an error as user email is not verified', () => {
    const user = { email: 'x@gmail.com', emailVerified: false };
    const adminEmails = ['x@gmail.com'];

    expect(() => beforeSignInHandler(user, {}, adminEmails)).toThrow();
  });

  it.each([
    ['z@gmail.com'],
    ['x@apple.com'],
  ])('Should return role: "user"', email => {
    const user = { email, emailVerified: true };
    const adminEmails = ['x@gmail.com'];

    const result = beforeSignInHandler(user, {}, adminEmails);

    expect(result).toEqual({
      customClaims: {
        role: 'user',
      },
    });
  });

  it('Should return role: "admin"', () => {
    const user = { email: 'x@gmail.com', emailVerified: true };
    const adminEmails = ['x@gmail.com'];

    const result = beforeSignInHandler(user, {}, adminEmails);

    expect(result).toEqual({
      customClaims: {
        role: 'admin',
      },
    });
  });

  it('Should return role: "user" as adminEmails is empty', () => {
    const user = { email: 'x@gmail.com', emailVerified: true };
    const adminEmails = [];

    const result = beforeSignInHandler(user, {}, adminEmails);

    expect(result).toEqual({
      customClaims: {
        role: 'user',
      },
    });
  });
});
