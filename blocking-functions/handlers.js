export const beforeSignInHandler = (user, context, adminEmails) => {
  const role = adminEmails.includes(user.email) ? 'admin' : 'user';

  console.log(`Signing in user: ${user.email} with role: ${role}`);
  return {
    customClaims: { role },
  }
};

