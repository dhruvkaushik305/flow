import type { NewUserType } from "~/utils/zodSchema";
import prisma from "../db";
import { userCookie } from "../cookies";
import * as bcrypt from "bcrypt";

export async function checkEmailId(emailId: string) {
  const existingUser = await prisma.user.findUnique({
    where: {
      emailId,
    },
  });

  if (existingUser) {
    return true;
  } else {
    return false;
  }
}

export async function verifyUserId(hashedUserId: string) {
  const userId = await userCookie.parse(hashedUserId);

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
      emailId: userData.emailId,
      password: hashedPassword,
      joinedAt: new Date().toISOString(),
    },
    select: {
      id: true,
    },
  });

  return newUser.id;
}

export async function checkPassword(emailId: string, userPassword: string) {
  const foundPassword = await prisma.user.findUnique({
    where: {
      emailId,
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

export async function fetchUserId(emailId: string) {
  const user = await prisma.user.findUnique({
    where: {
      emailId,
    },
    select: {
      id: true,
    },
  });

  return user?.id;
}
