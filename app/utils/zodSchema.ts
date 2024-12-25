import { z } from "zod";

const emailSchema = z.string().email({ message: "Please enter a valid email" });
const passwordSchema = z
  .string()
  .min(4, { message: "Password must be atleast 4 characters" });

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be atleast 3 characters long" }),
  email: emailSchema,
  password: passwordSchema,
});

export type NewUserType = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginUserType = z.infer<typeof loginSchema>;
