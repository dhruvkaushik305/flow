import prisma from "../db";

export async function getTodosById(userId: string){
    const todos = prisma.todo.findMany({
        where: {
            userId
        },
        select:{
            id: true,
            title: true,
            completed: true
        }
    });

    return todos;
}