import { Router } from 'express';
import * as ReviewsController from './reviews.controller';
import ensureAuth from '../../middleware/ensureAuth';

const router = Router();

router.get('/:productId', ReviewsController.getReviewsByProductId);
router.put('/', ensureAuth, ReviewsController.editReview);
router.post('/', ensureAuth, ReviewsController.createReview);

export default router;