'use client';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function CourseStartButton({ courseId }) {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверяем авторизацию
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        jwtDecode(token);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Ошибка декодирования токена:', err);
      }
    }
  }, []);

  const handleStartCourse = async () => {
    setMessage(null);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Требуется аутентификация');
      return;
    }

    try {
      const response = await fetch('/api/lessons/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: parseInt(courseId) }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Не удалось начать курс');
      }

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleStartCourse}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Начать курс
      </button>
      {message && <p className="mt-2 text-green-500">{message}</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}