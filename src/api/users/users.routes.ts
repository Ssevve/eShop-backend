import { Router } from 'express';
import * as UsersController from './users.controller';
import validateRequest from '../../middleware/validateRequest';
import { registerSchema } from './users.schemas';

const router = Router();

router.get('/:firebaseId', UsersController.getUserByFirebaseId);
router.post('/register', validateRequest(registerSchema), UsersController.registerUser);

export default router;