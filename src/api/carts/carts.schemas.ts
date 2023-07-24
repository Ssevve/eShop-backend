import { productConstraints } from '@/lib/constants';
import { invalidProductIdMessage, requiredProductIdMessage } from '@/lib/errorMessages';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const invalidQuantityErrorMessage = 'Invalid quantity value.';

export const addCartProductSchema = z.object({
  body: z.object({
    productId: z
      .string({
        required_error: requiredProductIdMessage,
      })
      .refine((val) => ObjectId.isValid(val), { message: invalidProductIdMessage }),
    quantity: z
      .number({
        required_error: 'Quantity is required.',
      })
      .min(productConstraints.quantity.min, invalidQuantityErrorMessage)
      .max(productConstraints.quantity.max, invalidQuantityErrorMessage),
  }),
  params: z.object({
    cartId: z
      .string({
        required_error: 'Cart ID is required.',
      })
      .refine((val) => ObjectId.isValid(val), { message: 'Invalid cart ID.' }),
  }),
});