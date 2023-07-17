function useAuthZ(requiredRole) {
  return function(req, res, next) {
    console.log('In AuthZ middleware');

    const user = res.locals.user;
    if (!user) {
      console.log('User not found in context');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!user.role) {
      console.log('User role not set');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (user.role !== requiredRole) {
      console.log(`User with email ${user.email} and role ${user.role} tried to access a route that was for the ${requiredRole} role only`);
      return res.status(403).json({ message: 'Forbidden' });
    }

    console.log(`User with email ${user.email} and role ${user.role} authorized`);

    next();
  };
}

export { useAuthZ };
