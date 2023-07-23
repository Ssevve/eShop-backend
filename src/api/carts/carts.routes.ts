import ensureAuth from '@/middleware/ensureAuth';
import validateRequest from '@/middleware/validateRequest';
import { Router } from 'express';
import * as CartsController from './carts.controller';
import { updateCartSchema } from './carts.schemas';

const router = Router();

router.get('/', ensureAuth, CartsController.getCartByUserId);
router.patch('/:cartId', ensureAuth, validateRequest(updateCartSchema), CartsController.updateCartById);

export default router;