const prisma = require('../../../../lib/prisma');
const jwt = require('jsonwebtoken');

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: { select: { id: true, fullName: true } },
        modules: { select: { id: true, title: true, order: true } },
      },
    });
    if (!course) {
      return new Response(JSON.stringify({ error: 'Курс не найден' }), { status: 404 });
    }
    return new Response(JSON.stringify(course), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Не удалось получить курс' }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const { title, description, authorId } = await request.json();
  try {
    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        author: authorId ? { connect: { id: parseInt(authorId) } } : undefined,
      },
    });
    return new Response(JSON.stringify(course), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Не удалось обновить курс' }), { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  try {
    if (!token) {
      return new Response(JSON.stringify({ error: 'Требуется аутентификация' }), { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const course = await prisma.course.findUnique({ where: { id: parseInt(id) } });
    if (!course) {
      return new Response(JSON.stringify({ error: 'Курс не найден' }), { status: 404 });
    }
    if (course.authorId !== decoded.id) {
      return new Response(JSON.stringify({ error: 'Доступ запрещён' }), { status: 403 });
    }

    // Удаляем связанные записи в транзакции
    await prisma.$transaction([
      prisma.lessonProgress.deleteMany({
        where: {
          lesson: {
            module: { courseId: parseInt(id) },
          },
        },
      }),
      prisma.lessonLink.deleteMany({
        where: {
          lesson: {
            module: { courseId: parseInt(id) },
          },
        },
      }),
      prisma.lesson.deleteMany({
        where: {
          module: { courseId: parseInt(id) },
        },
      }),
      prisma.module.deleteMany({
        where: { courseId: parseInt(id) },
      }),
      prisma.course.delete({
        where: { id: parseInt(id) },
      }),
    ]);

    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Не удалось удалить курс' }), { status: 500 });
  }
}