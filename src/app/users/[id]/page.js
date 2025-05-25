import prisma from '../../../lib/prisma';
import ProfileCourses from '../../components/ProfileCourses';
import Link from 'next/link';

export default async function UserProfilePage({ params }) {
  const { id } = await params;
  console.log(id)

  // Валидация id
  if (!id || isNaN(parseInt(id))) {
    return <div className="p-4 text-red-500">Некорректный ID пользователя</div>;
  }

  // Получение данных пользователя
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: { id: true, fullName: true, email: true, role: true },
  });

  if (!user) {
    return <div className="p-4 text-red-500">Пользователь не найден</div>;
  }

  // Получение курсов пользователя
  const courses = await prisma.course.findMany({
    where: { authorId: parseInt(id) },
    include: {
      author: { select: { id: true, fullName: true } },
      modules: { select: { id: true, title: true, order: true } },
    },
  });

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">{user.fullName || 'Пользователь'}</h1>
      <p className="mb-2">Email: {user.email}</p>
      <p className="mb-4">Роль: {user.role || 'Не указана'}</p>
      <h2 className="text-2xl font-semibold mb-4">Курсы</h2>
      <ProfileCourses courses={courses} id={parseInt(id)} />
    </div>
  );
}