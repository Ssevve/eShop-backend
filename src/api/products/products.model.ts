import * as z from 'zod';
import { ObjectId } from 'mongodb';
import { db } from '../../db';

const Product = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string(),
  brand: z.string(),
  price: z.number(),
  discountPrice: z.number(),
  imageUrl: z.string().url(),
  quantity: z.string(),
  category: z.string(),
  rating: z.number(),
  ratingsCount: z.number(),
  description: z.string(),
});

export type Product = z.infer<typeof Product>;
export const Products = db.collection<Product>('products');