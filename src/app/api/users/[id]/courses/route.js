const prisma = require('../../../../../lib/prisma');

export async function GET(request, { params }) {
  const { userId } = await params; 

  // Валидация userId
  if (!userId || isNaN(parseInt(userId))) {
    return new Response(JSON.stringify({ error: 'Некорректный ID пользователя' }), { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { status: 404 });
    }

    const courses = await prisma.course.findMany({
      where: { authorId: parseInt(userId) },
      include: {
        author: { select: { id: true, fullName: true } },
        modules: { select: { id: true, title: true, order: true } },
      },
    });

    return new Response(JSON.stringify(courses), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Не удалось получить курсы пользователя' }), { status: 500 });
  }
}