import { productConstraints } from '@/lib/constants';
import { invalidProductIdMessage, requiredProductIdMessage } from '@/lib/errorMessages';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const invalidAmountErrorMessage = 'Invalid amount value.';
const requiredAmountErrorMessage = 'Amount is required.';
const invalidCartIdErrorMessage = 'Invalid cart ID.';

export const addCartProductSchema = z.object({
  body: z.object({
    productId: z
      .string({
        required_error: requiredProductIdMessage,
      })
      .refine((val) => ObjectId.isValid(val), { message: invalidProductIdMessage }),
    amount: z
      .number({
        required_error: requiredAmountErrorMessage,
      })
      .min(productConstraints.amount.min, invalidAmountErrorMessage)
      .max(productConstraints.amount.max, invalidAmountErrorMessage),
  }),
  params: z.object({
    cartId: z
      .string()
      .refine((val) => ObjectId.isValid(val), { message: invalidCartIdErrorMessage }),
  }),
});

export const updateCartProductAmountSchema = z.object({
  body: z.object({
    amount: z
      .number({
        required_error: requiredAmountErrorMessage,
      })
      .min(productConstraints.amount.min, invalidAmountErrorMessage)
      .max(productConstraints.amount.max, invalidAmountErrorMessage),
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

export const removeCartProductSchema = z.object({
  params: z.object({
    cartId: z
      .string()
      .refine((val) => ObjectId.isValid(val), { message: invalidCartIdErrorMessage }),
    productId: z
      .string()
      .refine((val) => ObjectId.isValid(val), { message: invalidProductIdMessage }),
  }),
});

export const clearCartSchema = z.object({
  params: z.object({
    cartId: z
      .string()
      .refine((val) => ObjectId.isValid(val), { message: invalidCartIdErrorMessage }),
  }),
});