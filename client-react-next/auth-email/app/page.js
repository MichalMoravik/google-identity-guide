'use client';
import { useState } from 'react';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const registerWithEmail = async (email, password) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      console.log(cred.user);
    } catch (error) {
      console.log(error);
    }
  }

  const signInWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      const { claims } = await auth.currentUser.getIdTokenResult(true);
      console.log("claims: ", claims);

      if (claims.role === 'admin') router.push('/admin');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
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
