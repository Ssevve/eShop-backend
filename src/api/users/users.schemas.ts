import { userConstraints } from '@/lib/constants';
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required.',
    }).email(),
    password: z.string({
      required_error: 'Password is required.',
    }).min(userConstraints.password.min, `Minimum password length is ${userConstraints.password.min}`),
    firstName: z.string({
      required_error: 'First name is required.',
    }).min(userConstraints.firstName.min, `Minimum first name length is ${userConstraints.firstName.min}`),
    lastName: z.string({
      required_error: 'Last name is required.',
    }).min(userConstraints.firstName.min, `Minimum last name length is ${userConstraints.firstName.min}`),
  }),
});