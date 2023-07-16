import gcipCloudFunctions from 'gcip-cloud-functions';

export const beforeSignInHandler = (user, context, adminEmails) => {
  if (!user.emailVerified) {
    throw new gcipCloudFunctions.https.HttpsError('invalid-argument', `UNVERIFIED_EMAIL`);
  }

  const role = adminEmails.includes(user.email) ? 'admin' : 'user';

  console.log(`Signing in user: ${user.email} with role: ${role}`);
  return {
    customClaims: { role },
  }
};

