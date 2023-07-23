import ensureAuth from '@/middleware/ensureAuth';
import { Router } from 'express';
import * as CartsController from './carts.controller';

const router = Router();

router.get('/', ensureAuth, CartsController.getCartByUserId);
router.patch('/:cartId', ensureAuth, CartsController.updateCartById);

export default router;