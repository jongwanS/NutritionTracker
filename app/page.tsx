'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Next.js가 준비되면 기존 앱으로 리디렉션 (개발 중 임시 방법)
    window.location.href = '/';
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">영양 트래커</h1>
      <p className="text-gray-600 mb-6">마이그레이션이 진행 중입니다...</p>
    </main>
  );
}