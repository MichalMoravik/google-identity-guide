import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDYFOp1rKlnOdq9pMUJWyiaovpd9EsfuBc',
  authDomain: 'elevated-cat-392517.firebaseapp.com',
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
