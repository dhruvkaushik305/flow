import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be atleast 3 characters long" }),
  emailId: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(4, { message: "Password must be atleast 4 characters" }),
});

export type NewUserType = z.infer<typeof signupSchema>;
