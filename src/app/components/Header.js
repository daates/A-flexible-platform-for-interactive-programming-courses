'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import { usePathname } from 'next/navigation';


export default function Header() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.id, fullName: decoded.fullName });
      } catch (err) {
        console.error('Ошибка декодирования токена:', err);
      }
    }
  }, []);

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  
  return (
    <header className="bg-blue-600 text-white p-4 m-4 border-4 rounded-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
        </Link>
        <nav className="space-x-4">
          <Link href="/courses" className="hover:underline">
            Все курсы
          </Link>
          {user ? (
            <>
              <Link href="/my-courses" className="hover:underline">
                Мои курсы
              </Link>
              <Link href={`/users/${user.id}`} className="hover:underline">
                Профиль
              </Link>
            </>
          ) : (
            <Link href="/login" className="hover:underline">
              Вход
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}