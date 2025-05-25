const prisma = require('../../../../lib/prisma');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../../../lib/auth');

export async function POST(request) {
  try {
    const { email, fullName, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email и пароль обязательны' }), { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Пользователь уже существует' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        password: hashedPassword,
        role: 'student', 
      },
    });

    const token = generateToken(user);
    return new Response(JSON.stringify({ user: { id: user.id, email, fullName, role: user.role }, token }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Не удалось зарегистрировать пользователя' }), { status: 500 });
  }
}