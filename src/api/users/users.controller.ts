import MessageResponse from '@/types/MessageResponse';
import { NextFunction, Request, Response } from 'express';
import { WithId } from 'mongodb';
import { User } from './users.model';
import * as UsersService from './users.service';
import { GetUserByFirebaseIdParams, RegisterUserReqBody, RegisterUserResBody } from './users.types';

const getUserByFirebaseId = async (req: Request<GetUserByFirebaseIdParams, {}, {}, {}>, res: Response<WithId<User> | MessageResponse>, next: NextFunction) => {
  try {
    const user = await UsersService.findSingleByFirebaseId(req.params.firebaseId);
    if (!user) return res.status(404).json({ message: 'User with provided Firebase ID not found.' });
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req: Request<{}, {}, RegisterUserReqBody, {}>, res: Response<RegisterUserResBody>, next: NextFunction) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const newUser = await UsersService.insertSingle({ email, password, firstName, lastName });
    if (!newUser) return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') res.statusCode = 409;
    next(error);
  }
};

export { getUserByFirebaseId, registerUser };

