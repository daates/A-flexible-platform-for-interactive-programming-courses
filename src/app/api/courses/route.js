const prisma = require('../../../lib/prisma');

export async function GET() {
    try{
        const courses = await prisma.courses.findMany({
            select: {
                
            }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Не удалось получить список курсов'}), {status: 500});
    }
}