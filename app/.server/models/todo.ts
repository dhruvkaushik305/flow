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
        },
        select:{
            id: true
        }
    });

    return newTodo.id
}

export async function toggleTodo(todoId: string, newState: boolean){
    const updateTodo = await prisma.todo.update({
        where:{
            id: todoId
        },
        data:{
            completed: newState
        },
        select: {
            id: true
        }
    });

    return updateTodo.id
}