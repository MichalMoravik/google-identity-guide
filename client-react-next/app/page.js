'use client';
import { auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function Home() {
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  )
}
