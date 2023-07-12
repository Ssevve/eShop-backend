import { Router } from 'express';
import { z } from 'zod';
import * as ReviewsController from './reviews.controller';
import ensureAuth from '../../middleware/ensureAuth';
import { productConstraints } from '../../lib/constants';
import validate from '../../middleware/validate';

const ratingErrorMessage = `Rating needs to be between ${productConstraints.rating.min} and ${productConstraints.rating.max}`;
const invalidReviewIdErrorMessage = 'Invalid review ID.';
const invalidProductIdErrorMessage = 'Invalid product ID.';

const createReviewSchema = z.object({
  rating: z.number({
    required_error: 'Rating is required.',
  }).min(productConstraints.rating.min, ratingErrorMessage).max(productConstraints.rating.max, ratingErrorMessage),
  productId: z.string({
    required_error: 'Product ID is required.',
  }).min(24, invalidProductIdErrorMessage).max(24, invalidProductIdErrorMessage),
});

const editReviewSchema = z.object({
  rating: z.number({
    required_error: 'Rating is required.',
  }).min(productConstraints.rating.min, ratingErrorMessage).max(productConstraints.rating.max, ratingErrorMessage),
  _id: z.string({
    required_error: 'Review ID is required.',
  }).min(24, invalidReviewIdErrorMessage).max(24, invalidReviewIdErrorMessage),
});

const router = Router();

router.get('/:productId', ReviewsController.getReviewsByProductId);
router.put('/:reviewId', ensureAuth, validate(editReviewSchema), ReviewsController.editReview);
router.post('/', ensureAuth, validate(createReviewSchema), ReviewsController.createReview);

export default router;