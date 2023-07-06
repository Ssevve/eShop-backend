import { Router } from 'express';
import * as ProductsController from './products.controller';

const router = Router();

router.get('/', ProductsController.getProducts);
router.get('/:id', ProductsController.getProductById);

export default router;