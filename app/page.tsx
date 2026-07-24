'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

export default function RootPage() {
  const { accessToken, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(accessToken ? '/trips' : '/login');
  }, [loading, accessToken, router]);

  return null;
}
