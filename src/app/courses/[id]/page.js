import prisma from '../../../lib/prisma';
import Link from 'next/link';

export default async function CoursePage({ params }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: { select: { id: true, fullName: true } },
      modules: { select: { id: true, title: true, order: true } },
    },
  });

  if (!course) {
    return <div className="p-4 text-red-500">Курс не найден</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="mb-2">
        Автор:{' '}
        <Link href={`/users/${course.author.id}`} className="text-blue-500 hover:underline">
          {course.author.fullName || 'Пользователь'}
        </Link>
      </p>
      <p className="mb-4">Описание: {course.description || 'Нет описания'}</p>
      <h2 className="text-2xl font-semibold mb-4">Модули</h2>
      <ul className="space-y-2">
        {course.modules.map((module) => (
          <li key={module.id}>{module.title} (Порядок: {module.order})</li>
        ))}
      </ul>
    </div>
  );
}