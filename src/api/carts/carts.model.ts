import { ObjectId } from 'mongodb';
import * as z from 'zod';
import { db } from '@/db';

const CartProduct = z.object({
  productId: z.instanceof(ObjectId),
  quantity: z.number(),
});

const Cart = z.object({
  userId: z.instanceof(ObjectId),
  products: z.array(CartProduct),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type CartProduct = z.infer<typeof CartProduct>;
export type Cart = z.infer<typeof Cart>;
export const Carts = db.collection<Cart>('carts');