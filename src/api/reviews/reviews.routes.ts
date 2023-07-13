import { Router } from 'express';
import * as ReviewsController from './reviews.controller';
import ensureAuth from '../../middleware/ensureAuth';
import validateRequest from '../../middleware/validateRequest';
import { createReviewSchema, editReviewSchema } from './reviews.schemas';

const router = Router();

router.get('/:productId', ReviewsController.getReviewsByProductId);
router.put('/:reviewId/:productId', ensureAuth, validateRequest(editReviewSchema), ReviewsController.editReview);
router.post('/', ensureAuth, validateRequest(createReviewSchema), ReviewsController.createReview);

export default router;