import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email({ message: "Пожалуйста, введите корректный адрес электронной почты." }),
  password: z.string().min(8, { message: "Пароль должен содержать не менее 8 символов." }),
});

export const signUpSchema = signInSchema.extend({
  username: z
    .string()
    .min(5, { message: "Имя пользователя должно содержать не менее 5 символов." })
    .max(30, { message: "Имя пользователя должно содержать не более 30 символов." }),
});
