const prisma = require('../../../lib/prisma');

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true
      },
    });
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Не удалось получить пользователей' }), { status: 500 });
  }
}

export async function POST(request) {
  const { email, fullName, password, role } = await request.json();
  try {
    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        password, 
        role
      },
    });
    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Не удалось создать пользователя' }), { status: 400 });
  }
}