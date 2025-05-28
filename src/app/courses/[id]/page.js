import prisma from '../../../lib/prisma';
import Link from 'next/link';
import CourseStartButton from '../../components/CourseStartButton';

export default async function CoursePage({ params }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id: +id },
    include: {
      author: { select: { id: true, fullName: true } },
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: { orderBy: { order: 'asc' } },
        },
      },
    },
  });

  if (!course) {
    return <div className="p-4 text-red-500">Курс не найден</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/courses" className="text-blue-500 hover:underline">
         Назад к курсам
      </Link>
      <h1 className="text-3xl font-bold mt-4">{course.title}</h1>
      <p className="mt-2 text-gray-600">{course.description || 'Нет описания'}</p>
      <p className="mt-2">
        Автор:{' '}
        <Link href={`/users/${course.author.id}`} className="text-blue-500 hover:underline">
          {course.author.fullName}
        </Link>
      </p>
      <CourseStartButton courseId={id} />
      <h2 className="text-2xl font-bold mt-6">Модули</h2>
      {course.modules.length === 0 ? (
        <p>Модули отсутствуют</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {course.modules.map((module) => (
            <li key={module.id} className="border p-4 rounded-lg">
              <h3 className="text-xl font-semibold">{module.title}</h3>
              <h4 className="text-lg font-medium mt-2">Уроки</h4>
              {module.lessons.length === 0 ? (
                <p>Уроки отсутствуют</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id} className="border-l-2 pl-2">
                      <Link href={`/lessons/${lesson.id}`} className="text-blue-500 hover:underline">
                        {lesson.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}