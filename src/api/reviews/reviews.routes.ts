import { Router } from 'express';
import * as ReviewsController from './reviews.controller';

const router = Router();

router.get('/:productId', ReviewsController.getReviewsByProductId);
router.put('/', ReviewsController.editReview);
router.post('/', ReviewsController.createReview);

export default router;