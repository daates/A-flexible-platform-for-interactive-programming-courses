const prisma = require('../../../../lib/prisma');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../../../lib/auth');

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email и пароль обязательны' }), { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: 'Неверный пароль' }), { status: 401 });
    }

    const token = generateToken(user);
    return new Response(JSON.stringify({ user: { id: user.id, email, fullName: user.fullName, role: user.role }, token }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Не удалось войти' }), { status: 500 });
  }
}