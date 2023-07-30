import attachReqUser from '@/middleware/attachReqUser';
import validateRequest from '@/middleware/validateRequest';
import { Router } from 'express';
import * as CartsController from './carts.controller';
import { addCartProductSchema, clearCartSchema, removeCartProductSchema, updateCartProductAmountSchema } from './carts.schemas';

const router = Router();

router.get('/', attachReqUser, CartsController.getCart);
router.post('/:cartId/products', attachReqUser, validateRequest(addCartProductSchema), CartsController.addCartProduct);
router.patch('/:cartId/products/:productId', attachReqUser, validateRequest(updateCartProductAmountSchema), CartsController.updateCartProductAmount);
router.delete('/:cartId/products/:productId', attachReqUser, validateRequest(removeCartProductSchema), CartsController.removeCartProduct);
router.delete('/:cartId/products', attachReqUser, validateRequest(clearCartSchema), CartsController.clearCart);

export default router;