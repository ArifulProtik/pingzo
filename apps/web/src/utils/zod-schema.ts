import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.email('Invalid email address'),
  username: z
    .string()
    .min(6, 'Username must be at least 6 characters long')
    .regex(/^\S+$/, 'Username cannot contain spaces'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});
