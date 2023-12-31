function useAuth(authClient) {
  return async function(req, res, next) {
    console.log('In Auth middleware');

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('Missing Authorization header');
      return res.status(400).json({ message: 'Missing Authorization header' });
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      console.log('Invalid Authorization header');
      return res.status(400).json({ message: 'Invalid Authorization header' });
    }

    let decodedToken;
    try {
      decodedToken = await authClient.verifyIdToken(token);
    } catch (error) {
      console.log(`Error verifying token. Error: ${error}`);
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    // Only needed for untrusted providers (e.g. email/password)
    // But I suggest verifying it for all providers
    if (!decodedToken.email_verified) {
      console.log('Email not verified');
      return res.status(401).json({ message: 'Email not verified' });
    }

    if (!decodedToken.role) {
      console.log('Role not present in token');
      return res.status(401).json({ message: 'Role not present in token' });
    }

    const user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role,
    };
    res.locals.user = user;

    console.log('Successfully authenticated');
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);

    next();
  };
}

export { useAuth };
