import ensureAuth from '@/middleware/ensureAuth';
import validateRequest from '@/middleware/validateRequest';
import { Router } from 'express';
import * as CartsController from './carts.controller';
import { addCartProductSchema } from './carts.schemas';

const router = Router();

router.get('/', ensureAuth, CartsController.getCartByUserId);
router.post('/:cartId/products', ensureAuth, validateRequest(addCartProductSchema), CartsController.addCartProduct);
// router.patch('/:cartId/products/:productId', ensureAuth, CartsController.updateCartProductQuantity);
// router.delete('/:cartId/products/:productId', ensureAuth, CartsController.removeCartProduct);
// router.delete('/:cartId/products', ensureAuth, CartsController.clearCart);

export default router;