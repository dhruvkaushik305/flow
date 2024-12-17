import type { NewUserType } from "~/utils/zodSchema";
import prisma from "../db";
import { userCookie } from "../cookies";
import * as bcrypt from "bcrypt";

export async function verifyEmailId(emailId: string) {
  const existingUser = await prisma.user.findUnique({
    where: {
      emailId,
    },
  });

  if (existingUser) {
    return false; //signifies that the verify check failed, this email is not allowed
  } else {
    return true;
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
