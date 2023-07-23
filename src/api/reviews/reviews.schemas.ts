import { productConstraints } from '@/lib/constants';
import { invalidProductIdMessage, requiredProductIdMessage } from '@/lib/errorMessages';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const ratingConstraintsErrorMessage = `Rating needs to be between ${productConstraints.rating.min} and ${productConstraints.rating.max}`;
const invalidReviewIdMessage = 'Invalid review ID.';
const requiredRatingMessage = 'Rating is required.';

export const createReviewSchema = z.object({
  body: z.object({
    rating: z
      .number({
        required_error: requiredRatingMessage,
      })
      .min(productConstraints.rating.min, ratingConstraintsErrorMessage)
      .max(productConstraints.rating.max, ratingConstraintsErrorMessage),
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
      .min(productConstraints.rating.min, ratingConstraintsErrorMessage)
      .max(productConstraints.rating.max, ratingConstraintsErrorMessage),
  }),
  params: z.object({
    reviewId: z
      .string()
      .min(24, invalidReviewIdMessage)
      .max(24, invalidReviewIdMessage),
    productId: z
      .string()
      .min(24, invalidProductIdMessage)
      .max(24, invalidProductIdMessage),
  }),  
});