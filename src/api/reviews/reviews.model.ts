import * as z from 'zod';
import { db } from '../../db';

const Review = z.object({
  productId: z.string(),
  userId: z.string(),
  message: z.string(),
  rating: z.number(),
});

export type Review = z.infer<typeof Review>;
export const Reviews = db.collection<Review>('reviews');