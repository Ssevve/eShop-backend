import { Router } from 'express';
import ensureAuth from '../../middleware/ensureAuth';
import validateRequest from '../../middleware/validateRequest';
import * as ReviewsController from './reviews.controller';
import { createReviewSchema, editReviewSchema } from './reviews.schemas';

const router = Router();

router.get('/product/:productId', ReviewsController.getReviewsByProductId);
router.get('/user/:userId', ReviewsController.getReviewsByUserId);
router.put('/:reviewId/:productId', ensureAuth, validateRequest(editReviewSchema), ReviewsController.editReview);
router.post('/', ensureAuth, validateRequest(createReviewSchema), ReviewsController.createReview);

export default router;