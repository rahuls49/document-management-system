
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = getCookie('auth-token');
    if (!token) {
      router.replace('/');
    } else {
      setIsVerified(true);
    }
  }, [router]);

  if (!isVerified) {
    return (
      <div className='h-screen w-screen flex justify-center items-center'>
        <div className="relative h-16 w-16 rounded bg-white overflow-hidden">
          <div className="absolute left-0 bottom-0 w-10 h-10 bg-[#ff9371] rotate-45 translate-x-[30%] translate-y-[40%] animate-slide shadow-[32px_-34px_0_5px_#ff3d00]"></div>
          <div className="absolute left-2.5 top-2.5 w-4 h-4 bg-[#ff3d00] rounded-full animate-rotate origin-[35px_145px]"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
