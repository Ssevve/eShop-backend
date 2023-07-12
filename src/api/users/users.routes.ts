import { Router } from 'express';
import * as UsersController from './users.controller';
import validate from '../../middleware/validate';
import { z } from 'zod';
import { userConstraints } from '../../lib/constants';

const registerSchema = z.object({
  email: z.string({
    required_error: 'Email is required.',
  }).email(),
  password: z.string({
    required_error: 'Password is required.',
  }).min(userConstraints.password.min, `Minimum password length is ${userConstraints.password.min}`),
  firstName: z.string({
    required_error: 'First name is required.',
  }).min(userConstraints.firstName.min, `Minimum first name length is ${userConstraints.firstName.min}`),
  lastName: z.string({
    required_error: 'Last name is required.',
  }).min(userConstraints.firstName.min, `Minimum last name length is ${userConstraints.firstName.min}`),
});


const router = Router();

router.get('/:firebaseId', UsersController.getUserByFirebaseId);
router.post('/register', validate(registerSchema), UsersController.registerUser);

export default router;