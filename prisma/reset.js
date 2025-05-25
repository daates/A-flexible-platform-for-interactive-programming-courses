const { PrismaClient } = require('@prisma/client');

     const prisma = new PrismaClient();

     async function main() {
       await prisma.lessonProgress.deleteMany({});
       await prisma.lessonLink.deleteMany({});
       await prisma.lesson.deleteMany({});
       await prisma.module.deleteMany({});
       await prisma.course.deleteMany({});
       await prisma.user.deleteMany({});

       console.log('Все данные удалены');
     }

     main()
       .catch((e) => {
         console.error(e);
         process.exit(1);
       })
       .finally(async () => {
         await prisma.$disconnect();
       });