import { ObjectId } from 'mongodb';
import * as z from 'zod';
import { db } from '@/db';

const Review = z.object({
  productId: z.instanceof(ObjectId),
  userFirstName: z.string(),
  userId: z.instanceof(ObjectId),
  message: z.string(),
  rating: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Review = z.infer<typeof Review>;
export const Reviews = db.collection<Review>('reviews');