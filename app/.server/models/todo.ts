import prisma from "../db";

export async function getTodosById(userId: string){
    const todos = await prisma.todo.findMany({
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

export async function createTodo(userId: string, title: string){
    const newTodo = await prisma.todo.create({
        data:{
            title,
            userId,
            completed: false,
            dateCreated: new Date().toISOString()
        }
    });

    return newTodo.id
}