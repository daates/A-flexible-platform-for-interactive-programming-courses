import prisma from '../../../lib/prisma';
import Link from 'next/link';
import LessonCompleteButton from '../../components/LessonCompleteButton';
import MarkdownViewer from '../../components/MarkdownViewer';
import PythonEditor from '../../components/PythonEditor';

export default async function LessonPage({ params }) {
  const { id } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: +id },
    include: {
      module: {
        include: {
          course: true,
        },
      },
      lessonLinksFrom: {
        include: {
          to: true,
        },
      },
      lessonLinksTo: {
        include: {
          from: true,
        },
      },
    },
  });

  if (!lesson) {
    return <div>Урок не найден</div>;
  }

  let previousLesson = null;
  if (lesson.lessonLinksTo.length > 0) {
    previousLesson = lesson.lessonLinksTo[0].from; 
  } else {
    previousLesson = await prisma.lesson.findFirst({
      where: {
        moduleId: lesson.moduleId,
        order: { lt: lesson.order },
      },
      orderBy: { order: 'desc' },
    });
  }

  return (
    <div className="container mx-auto p-4">
      <Link
        href={`/courses/${lesson.module.courseId}`}
        className="text-blue-500 hover:underline"
      >
        Назад к курсу
      </Link>
      <h1 className="text-3xl font-bold mt-4">{lesson.title}</h1>
      <p className="mt-2 text-gray-600">
        Модуль: {lesson.module.title} (Курс: {lesson.module.course.title})
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
       <div className="border p-4 rounded-lg">
          {lesson.content ? (
            <MarkdownViewer content={lesson.content} />
          ) : (
            <p>Теория отсутствует</p>
          )}
        </div>

        {/* Блок редактора */}
        <div className="border p-4 rounded-lg">
          <PythonEditor />
        </div>
      </div>

      {/* Кнопка завершения */}
      <LessonCompleteButton lessonId={lesson.id} />

      {/* Навигация */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        {previousLesson && (
          <Link
            href={`/lessons/${previousLesson.id}`}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            ← Предыдущий урок
          </Link>
        )}
        {lesson.lessonLinksFrom.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">Следующие уроки:</span>
            {lesson.lessonLinksFrom.map((link) => (
              <Link
                key={link.id}
                href={`/lessons/${link.toId}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {link.to.title}
                {link.condition && ` (${link.condition})`}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}