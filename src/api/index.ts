import express, { Request, Response } from 'express';
import MessageResponse from '@/types/MessageResponse';
import productsRoutes from './products/products.routes';
import reviewsRoutes from './reviews/reviews.routes';
import usersRoutes from './users/users.routes';
import cartsRoutes from './carts/carts.routes';

const router = express.Router();

router.get('/', (req: Request, res: Response<MessageResponse>) => {
  res.json({
    message: 'eShop API',
  });
});

router.use('/products', productsRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/users', usersRoutes);
router.use('/carts', cartsRoutes);

export default router;
