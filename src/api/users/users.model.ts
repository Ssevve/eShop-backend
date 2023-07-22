import * as z from 'zod';
import { db } from '@/db';

const User = z.object({
  email: z.string().email(),
  firebaseId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export type User = z.infer<typeof User>;
export const Users = db.collection<User>('users');