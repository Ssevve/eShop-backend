import express, { Request, Response } from 'express';
import MessageResponse from '../interfaces/MessageResponse';
import productsRoute from './products/products.routes';
import reviewsRoute from './reviews/reviews.routes';

const router = express.Router();

router.get('/', (req: Request, res: Response<MessageResponse>) => {
  res.json({
    message: 'eShop API',
  });
});

router.use('/products', productsRoute);
router.use('/reviews', reviewsRoute);

export default router;
