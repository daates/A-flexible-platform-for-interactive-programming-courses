import prisma from '../../../lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Проверяем токен
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Требуется авторизация' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const lessonProgress = await prisma.lessonProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Извлекаем уникальные курсы
    const courses = [];
    const courseIds = new Set();
    for (const progress of lessonProgress) {
      const course = progress.lesson.module.course;
      if (!courseIds.has(course.id)) {
        courseIds.add(course.id);
        courses.push(course);
      }
    }

    return new Response(JSON.stringify(courses), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return new Response(JSON.stringify({ error: 'Недействительный токен' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Ошибка сервера' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}