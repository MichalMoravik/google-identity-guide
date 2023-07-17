'use client';
import { useState } from 'react';
import { auth } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [msg, setMsg] = useState('');

  const registerWithEmail = async (email, password) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await sendEmailVerification(cred.user, { url: 'http://localhost:3000' });
      setMsg('Please verify your email before signing in');

      await signOut(auth);
    } catch (err) {
      console.log('Unexpected error: ', err);
    }
  }

  const signInWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      const { claims } = await auth.currentUser.getIdTokenResult(true);

      if (!claims.email_verified) {
        await sendEmailVerification(auth.currentUser, { url: 'http://localhost:3000' });
        setMsg('Please verify your email before signing in. We have sent you another verification email');
        await signOut(auth);
        return;
      }

      console.log('Signed in as: ', claims.email);

      if (claims.role === 'admin') router.push('/admin');
    } catch (err) {
      console.log('Unexpected error: ', err);
    }
  }

  return (
    <div>
      <div>{msg}</div>

      <h1>Registration</h1>
      <input
        type="text"
        name="email"
        placeholder="Email"
        onChange={e => setRegEmail(e.target.value)}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={e => setRegPassword(e.target.value)}
      />
      <button onClick={() => registerWithEmail(regEmail, regPassword)}>
        Register with Email
      </button>

      <h1>Sign in</h1>
      <input
        type="text"
        name="email"
        placeholder="Email"
        onChange={e => setSignInEmail(e.target.value)}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={e => setSignInPassword(e.target.value)}
      />
      <button onClick={() => signInWithEmail(signInEmail, signInPassword)}>
        Sign in with Email
      </button>
    </div>
  )
}
