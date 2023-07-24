import ensureAuth from '@/middleware/ensureAuth';
// import validateRequest from '@/middleware/validateRequest';
import { Router } from 'express';
import * as CartsController from './carts.controller';
// import { updateCartSchema } from './carts.schemas';

const router = Router();

router.get('/', ensureAuth, CartsController.getCartByUserId);
router.post('/:cartId/products', ensureAuth, CartsController.addCartProduct);
router.patch('/:cartId/products/:productId', CartsController.updateCartProductQuantity);
router.delete('/:cartId/products/:productId', CartsController.removeCartProduct);
router.delete('/:cartId/products', CartsController.clearCart);

export default router;