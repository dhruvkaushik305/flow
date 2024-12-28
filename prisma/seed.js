import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Hashed Passwords
  const hashedPasswordAlice = await bcrypt.hash('secret', 10);
  const hashedPasswordBob = await bcrypt.hash('secret', 10);
  const hashedPasswordCharlie = await bcrypt.hash('secret', 10);

  // Users
  const alice = await prisma.user.create({
    data: {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      password: hashedPasswordAlice,
      joinedAt: new Date().toISOString(),
    },
  });

  const bob = await prisma.user.create({
    data: {
      id: '2',
      name: 'Bob',
      email: 'bob@example.com',
      password: hashedPasswordBob,
      joinedAt: new Date().toISOString(),
    },
  });

  const charlie = await prisma.user.create({
    data: {
      id: '3',
      name: 'Charlie',
      email: 'charlie@example.com',
      password: hashedPasswordCharlie,
      joinedAt: new Date().toISOString(),
    },
  });

  // Todos
  await prisma.todo.createMany({
    data: [
      { id: '1', title: 'Todo 1', completed: false, userId: alice.id, dateCreated: new Date().toISOString() },
      { id: '2', title: 'Todo 2', completed: true, userId: bob.id, dateCreated: new Date().toISOString() },
      { id: '3', title: 'Todo 3', completed: false, userId: charlie.id, dateCreated: new Date().toISOString() },
    ],
  });

  // Activities
  await prisma.activity.createMany({
    data: [
      { id: '1', completedTodo: 1, timeStudied: 2.5 * 3600, dateTime: new Date(), userId: alice.id },
      { id: '2', completedTodo: 2, timeStudied: 3.0 * 3600, dateTime: new Date(), userId: bob.id },
      { id: '3', completedTodo: 0, timeStudied: 1.5 * 3600, dateTime: new Date(), userId: charlie.id },
    ],
  });

  // Follows
  await prisma.follow.createMany({
    data: [
      { id: '1', followerId: alice.id, followingId: bob.id },
      { id: '2', followerId: bob.id, followingId: charlie.id },
      { id: '3', followerId: charlie.id, followingId: alice.id },
    ],
  });

  console.log('The database has been seeded.');
}

main()
  .catch((e) => {
    console.error("The following error occured while seeding the database", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });