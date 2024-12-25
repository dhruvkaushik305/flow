import type { NewUserType } from "~/utils/zodSchema";
import prisma from "../db";
import { userCookie } from "../cookies";
import * as bcrypt from "bcrypt";
import invariant from "tiny-invariant";

export async function checkEmail(email: string) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return true;
  } else {
    return false;
  }
}

export async function verifyUserId(hashedUserId: string) {
  const userId: string | null = await userCookie.parse(
    `userId=${hashedUserId}`,
  );
  invariant(userId, "Decrypted user id cannot be null");

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (existingUser) {
    return true;
  } else {
    return false;
  }
}

export async function createNewUser(userData: NewUserType) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      joinedAt: new Date().toISOString(),
    },
    select: {
      id: true,
    },
  });

  return newUser.id;
}

export async function checkPassword(email: string, userPassword: string) {
  const foundPassword = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      password: true,
    },
  });

  if (!foundPassword) {
    return false;
  }

  const passwordsMatched = await bcrypt.compare(
    userPassword,
    foundPassword.password,
  );

  return passwordsMatched;
}

export async function fetchUserId(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return user?.id;
}
