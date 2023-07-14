import * as z from 'zod';
import { db } from '../../db';
import { ObjectId } from 'mongodb';

const Review = z.object({
  productId: z.instanceof(ObjectId),
  userFirstName: z.string(),
  userId: z.instanceof(ObjectId),
  message: z.string(),
  rating: z.number(),
});

export type Review = z.infer<typeof Review>;
export const Reviews = db.collection<Review>('reviews');