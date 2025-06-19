import { type z } from 'zod';
import type { signInSchema, signUpSchema } from '~/schemas/auth';

export type SignInParams = z.infer<typeof signInSchema>;
export type SignUpParams = z.infer<typeof signUpSchema>;
