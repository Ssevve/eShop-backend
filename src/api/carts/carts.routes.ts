import validateRequest from '@/middleware/validateRequest';
import { Router } from 'express';
import * as CartsController from './carts.controller';
import { addCartProductSchema, updateCartProductAmountSchema, removeCartProductSchema } from './carts.schemas';
import attachReqUser from '@/middleware/attachReqUser';

const router = Router();

router.get('/', attachReqUser, CartsController.getCart);
router.post('/:cartId/products', attachReqUser, validateRequest(addCartProductSchema), CartsController.addCartProduct);
router.patch('/:cartId/products/:productId', attachReqUser, validateRequest(updateCartProductAmountSchema), CartsController.updateCartProductAmount);
router.delete('/:cartId/products/:productId', attachReqUser, validateRequest(removeCartProductSchema), CartsController.removeCartProduct);
// router.delete('/:cartId/products', ensureAuth, CartsController.clearCart);

export default router;