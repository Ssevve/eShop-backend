import validateRequest from '@/middleware/validateRequest';
import { Router } from 'express';
import * as CartsController from './carts.controller';
import { addCartProductSchema } from './carts.schemas';
import attachReqUser from '@/middleware/attachReqUser';

const router = Router();

router.get('/', attachReqUser, CartsController.getCart);
router.post('/:cartId/products', validateRequest(addCartProductSchema), CartsController.addCartProduct);
// router.patch('/:cartId/products/:productId', ensureAuth, validateRequest(updateCartProductQuantitySchema), CartsController.updateCartProductQuantity);
// router.delete('/:cartId/products/:productId', ensureAuth, CartsController.removeCartProduct);
// router.delete('/:cartId/products', ensureAuth, CartsController.clearCart);

export default router;