'use client';
import Link from 'next/link';

export default function CourseList({ courses }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.length > 0 ? (
        courses.map((course) => (
          <div
            key={course.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <Link
              href={`/courses/${course.id}`}
              className="text-blue-500 hover:underline"
            >
              Перейти к курсу
            </Link>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Курсы отсутствуют</p>
      )}
    </div>
  );
}