const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
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

  const course = await prisma.course.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Введение в Python',
      description: 'Основы программирования на Python',
      authorId: user.id,
    },
  });

  const module1 = await prisma.module.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Основы Python',
      order: 1,
      courseId: course.id,
    },
  });

  const lesson1 = await prisma.lesson.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Переменные и типы данных',
      order: 1,
      moduleId: module1.id,
      type: 'python',
      content: `# Переменные

В Python переменные создаются при присваивании значения. Тип определяется автоматически:

\`\`\`python
x = 42        # Целое число
name = "Анна" # Строка
pi = 3.14     # Число с плавающей точкой
\`\`\`

**Примечание**: Имена переменных чувствительны к регистру.`,
    },
  });

  const lesson2 = await prisma.lesson.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Условные операторы',
      order: 2,
      moduleId: module1.id,
      type: 'python',
      content: `# Условные операторы

Используйте \`if\`, \`elif\`, \`else\` для управления потоком программы:

\`\`\`python
age = 18
if age >= 18:
    print("Совершеннолетний")
else:
    print("Несовершеннолетний")
\`\`\`

**Совет**: Условия могут включать операторы сравнения (\`>\`, \`<\`, \`==\`).`,
    },
  });

  const lesson3 = await prisma.lesson.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: 'Функции',
      order: 3,
      moduleId: module1.id,
      type: 'python',
      content: `# Функции

Функции в Python определяются с помощью \`def\`:

\`\`\`python
def greet(name):
    return f"Привет, {name}!"

print(greet("Мир"))  # Вывод: Привет, Мир!
\`\`\`

**Заметка**: Функции могут возвращать значения с помощью \`return\`.`,
    },
  });

  await prisma.lessonLink.upsert({
    where: { id: 1 },
    update: {},
    create: {
      fromId: lesson1.id,
      toId: lesson2.id,
      condition: null,
    },
  });

  await prisma.lessonLink.upsert({
    where: { id: 2 },
    update: {},
    create: {
      fromId: lesson2.id,
      toId: lesson3.id,
      condition: null,
    },
  });

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson1.id } },
    update: {},
    create: {
      userId: user.id,
      lessonId: lesson1.id,
      status: 'in_progress',
    },
  });

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });