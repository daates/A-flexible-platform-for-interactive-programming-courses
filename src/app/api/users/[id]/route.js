const prisma = require('../../../../lib/prisma');

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true
      },
    });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { status: 404 });
    }
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Не удалось получить пользователя', msg: error }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const { email, fullName, role } = await request.json();
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { email, fullName, role },
    });
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Не удалось обновить пользователя' }), { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Не удалось удалить пользователя' }), { status: 400 });
  }
}