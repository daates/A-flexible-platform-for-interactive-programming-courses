const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Добавление пользователя
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      fullName: 'Админ',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // Добавление курса
  const course = await prisma.course.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Введение в Python',
      description: 'Основы программирования на Python',
      authorId: user.id,
    },
  });

  // Добавление модуля
  const module1 = await prisma.module.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Основы Python',
      order: 1,
      courseId: course.id,
    },
  });

  // Добавление урока
  const lesson = await prisma.lesson.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Переменные и типы данных',
      order: 1,
      moduleId: module1.id,
      type: 'python',
    },
  });

  // Добавление прогресса урока
  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
    update: {},
    create: {
      userId: user.id,
      lessonId: lesson.id,
      status: 'work',
    },
  });

  console.log('Сидера выполнена');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });