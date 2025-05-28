const prisma = require('../../../../lib/prisma');
const jwt = require('jsonwebtoken');

export async function POST(request) {
  const { courseId } = await request.json();
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  try {
    if (!token) {
      return new Response(JSON.stringify({ error: 'Требуется аутентификация' }), { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Находим первый модуль курса (минимальный order)
    const firstModule = await prisma.module.findFirst({
      where: { courseId: parseInt(courseId) },
      orderBy: { order: 'asc' },
    });

    if (!firstModule) {
      return new Response(JSON.stringify({ error: 'Модули не найдены' }), { status: 404 });
    }

    // Находим первый урок модуля (минимальный order)
    const firstLesson = await prisma.lesson.findFirst({
      where: { moduleId: firstModule.id },
      orderBy: { order: 'asc' },
    });

    if (!firstLesson) {
      return new Response(JSON.stringify({ error: 'Уроки не найдены' }), { status: 404 });
    }

    // Проверяем, есть ли уже запись в LessonProgress
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: firstLesson.id,
        },
      },
    });

    if (existingProgress) {
      return new Response(JSON.stringify({ message: 'Курс уже начат' }), { status: 200 });
    }

    // Создаём запись в LessonProgress
    await prisma.lessonProgress.create({
      data: {
        userId: userId,
        lessonId: firstLesson.id,
        status: 'work',
      },
    });

    return new Response(JSON.stringify({ message: 'Курс начат', lessonId: firstLesson.id }), { status: 201 });
  } catch (error) {
    console.error('Ошибка старта курса:', error);
    return new Response(JSON.stringify({ error: 'Не удалось начать курс' }), { status: 500 });
  }
}