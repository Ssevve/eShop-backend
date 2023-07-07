import { Router } from 'express';
import * as UsersController from './users.controller';

const router = Router();

router.get('/:firebaseId', UsersController.getUserByFirebaseId);
router.post('/register', UsersController.registerUser);

export default router;