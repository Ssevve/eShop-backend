import MessageResponse from '@/types/MessageResponse';
import express, { Request, Response } from 'express';
import cartsRoutes from './carts/carts.routes';
import checkoutRoutes from './checkout/checkout.routes';
import productsRoutes from './products/products.routes';
import reviewsRoutes from './reviews/reviews.routes';
import usersRoutes from './users/users.routes';

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
router.use('/checkout', checkoutRoutes);

export default router;
