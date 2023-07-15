import express from 'express';
import { authClient } from './firebase.js';
import { useAuth } from './auth.js';
import { useAuthZ } from './authz.js';

const app = express();

app.get('/user', useAuth(authClient), useAuthZ('admin'), (req, res) => {
  const user = res.locals.user;
  res.json(user);
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
