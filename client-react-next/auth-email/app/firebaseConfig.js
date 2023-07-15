import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyClrNDRQ5j_S0cJVbvtpYr0HT2qNJTc0oQ",
  authDomain: "tonal-volt-392911.firebaseapp.com",
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
