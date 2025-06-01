const prisma = require('../../../lib/prisma');
const jwt = require('jsonwebtoken');

export async function GET(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  try {
    if (!token) {
      return new Response(JSON.stringify({ error: 'Требуется аутентификация' }), { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const lessonProgresses = await prisma.lessonProgress.findMany({
      where: { userId: decoded.id },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: {
                  include: {
                    author: { select: { id: true, fullName: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    const courses = [];
    const courseIds = new Set();
    for (const progress of lessonProgresses) {
      const course = progress.lesson.module.course;
      if (!courseIds.has(course.id)) {
        courseIds.add(course.id);
        courses.push(course);
      }
    }

    return new Response(JSON.stringify(courses), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Не удалось получить курсы' }), { status: 500 });
  }
}