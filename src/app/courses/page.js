import CourseList from '../components/CourseList';
import prisma from '../../lib/prisma';

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      description: true,
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Доступные курсы</h1>
      <CourseList courses={courses} />
    </div>
  );
}