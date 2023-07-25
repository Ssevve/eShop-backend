import { productConstraints } from '@/lib/constants';
import { invalidProductIdMessage, requiredProductIdMessage } from '@/lib/errorMessages';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const invalidQuantityErrorMessage = 'Invalid quantity value.';
const requiredQuantityErrorMessage = 'Quantity is required.';
const invalidCartIdErrorMessage = 'Invalid cart ID.';

export const addCartProductSchema = z.object({
  body: z.object({
    productId: z
      .string({
        required_error: requiredProductIdMessage,
      })
      .refine((val) => ObjectId.isValid(val), { message: invalidProductIdMessage }),
    quantity: z
      .number({
        required_error: requiredQuantityErrorMessage,
      })
      .min(productConstraints.quantity.min, invalidQuantityErrorMessage)
      .max(productConstraints.quantity.max, invalidQuantityErrorMessage),
  }),
  params: z.object({
    cartId: z
      .string()
      .refine((val) => ObjectId.isValid(val), { message: invalidCartIdErrorMessage }),
  }),
});

export const updateCartProductQuantitySchema = z.object({
  body: z.object({
    quantity: z
      .number({
        required_error: requiredQuantityErrorMessage,
      })
      .min(productConstraints.quantity.min, invalidQuantityErrorMessage)
      .max(productConstraints.quantity.max, invalidQuantityErrorMessage),
  }),
  params: z.object({
    cartId: z
      .string()
      .refine((val) => ObjectId.isValid(val), { message: invalidCartIdErrorMessage }),
    productId: z
      .string()
      .refine((val) => ObjectId.isValid(val), { message: invalidProductIdMessage }),
  }),
});