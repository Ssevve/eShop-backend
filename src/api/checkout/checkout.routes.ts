import { Router } from 'express';
import * as CheckoutController from './checkout.controller';

const router = Router();

router.post('/', CheckoutController.createCheckoutSession);

export default router;