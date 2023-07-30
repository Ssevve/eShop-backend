import { productConstraints } from '@/lib/constants';
import { invalidProductIdMessage, requiredProductIdMessage } from '@/lib/errorMessages';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const invalidRatingErrorMessage = 'Invalid rating value.';
const requiredRatingMessage = 'Rating is required.';

export const createReviewSchema = z.object({
  body: z.object({
    rating: z
      .number({
        required_error: requiredRatingMessage,
      })
      .min(productConstraints.rating.min, invalidRatingErrorMessage)
      .max(productConstraints.rating.max, invalidRatingErrorMessage),
    productId: z
      .string({
        required_error: requiredProductIdMessage,
      })
      .refine((val) => ObjectId.isValid(val), { message: invalidProductIdMessage }),
  }),
});

export const editReviewSchema = z.object({
  body: z.object({
    rating: z
      .number({
        required_error: requiredRatingMessage,
      })
      .min(productConstraints.rating.min, invalidRatingErrorMessage)
      .max(productConstraints.rating.max, invalidRatingErrorMessage),
  }),
  params: z.object({
    reviewId: z
      .string()
      .refine((val) => ObjectId.isValid(val), { message: 'Invalid review ID.' }),
    productId: z
      .string()
      .refine((val) => ObjectId.isValid(val), { message: invalidProductIdMessage }),
  }),  
});