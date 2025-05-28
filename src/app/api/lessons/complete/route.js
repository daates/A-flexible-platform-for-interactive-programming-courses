const prisma = require('../../../../lib/prisma');
const jwt = require('jsonwebtoken');

export async function POST(request) {
  const { lessonId } = await request.json();
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  try {
    if (!token) {
      return new Response(JSON.stringify({ error: 'Требуется аутентификация' }), { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Проверяем, существует ли запись в LessonProgress
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: parseInt(lessonId),
        },
      },
    });

    if (!existingProgress) {
      return new Response(JSON.stringify({ error: 'Прогресс не найден. Начните урок.' }), { status: 404 });
    }

    // Обновляем LessonProgress
    await prisma.lessonProgress.update({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: parseInt(lessonId),
        },
      },
      data: { completed: true },
    });

    return new Response(JSON.stringify({ message: 'Урок завершён' }), { status: 200 });
  } catch (error) {
    console.error('Ошибка завершения урока:', error);
    return new Response(JSON.stringify({ error: 'Не удалось завершить урок' }), { status: 500 });
  }
}