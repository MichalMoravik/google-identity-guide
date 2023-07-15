'use client';
import { auth } from '../firebaseConfig';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) router.push('/');

      const { claims } = await user.getIdTokenResult(true);
      if (claims.role !== 'admin') router.push('/');
    });
  }, []);

  return (
    <div>
      <h1>Admin</h1>
    </div>
  )
}
