import { db } from '@/db';
import * as z from 'zod';

const User = z.object({
  email: z.string().email(),
  firebaseId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export type User = z.infer<typeof User>;
export const Users = db.collection<User>('users');