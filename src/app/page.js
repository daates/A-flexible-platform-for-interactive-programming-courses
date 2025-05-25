import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Платформа курсов по программированию</h1>
      <div className="space-x-4">
        <Link href="/register">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Регистрация
          </button>
        </Link>
        <Link href="/login">
          <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Вход
          </button>
        </Link>
      </div>
    </div>
  );
}
