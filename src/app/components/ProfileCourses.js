'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

export default function ProfileCourses({ courses: initialCourses, id }) {
  const [courses, setCourses] = useState(initialCourses);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Проверка, является ли профиль личным
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsOwnProfile(decoded.id === id);
      } catch (err) {
        console.error('Ошибка декодирования токена:', err);
      }
    }
  }, [id]);

  // Удаление курса
  const handleDelete = async (courseId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Требуется аутентификация');
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Не удалось удалить курс');
      }

      // Обновляем список курсов
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {courses.length === 0 ? (
        <p>Курсы отсутствуют</p>
      ) : (
        <ul className="space-y-4">
          {courses.map((course) => (
            <li key={course.id} className="border p-4 rounded-lg">
              <Link href={`/courses/${course.id}`} className="text-blue-500 hover:underline">
                {course.title}
              </Link>
              <p>{course.description || 'Нет описания'}</p>
              {isOwnProfile && (
                <button
                  onClick={() => handleDelete(course.id)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Удалить
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {isOwnProfile && (
        <div className="mt-4 flex space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Создать курс
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}