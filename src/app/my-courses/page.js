'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CourseList from '../components/CourseList';
import { useAuth } from '../../lib/useAuth';

export default function MyCoursesPage() {
  const { isAuthenticated, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    async function fetchCourses() {
      try {
        const response = await fetch('/api/my-courses', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Не удалось загрузить курсы');
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Редирект выполняется
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Мои курсы</h1>
      {loading ? (
        <p className="text-gray-500">Загрузка...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <CourseList courses={courses} />
      )}
    </div>
  );
}