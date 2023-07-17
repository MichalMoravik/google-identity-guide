'use client';
import { auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const provider = new GoogleAuthProvider();
  const router = useRouter();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);

      const { claims } = await auth.currentUser.getIdTokenResult(true);
      if (claims.role === 'admin') router.push('/admin');
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
