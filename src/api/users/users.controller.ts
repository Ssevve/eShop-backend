import { NextFunction, Request, Response } from 'express';
import * as UsersService from './users.service';
import { User } from './users.model';
import { WithId } from 'mongodb';
import admin from '../../firebaseConfig';
import MessageResponse from '../../interfaces/MessageResponse';

interface GetUserByFirebaseIdParams {
  firebaseId: string;
}

async function getUserByFirebaseId(req: Request<GetUserByFirebaseIdParams, {}, {}, {}>, res: Response<WithId<User> | MessageResponse>, next: NextFunction) {
  try {
    const user = await UsersService.findUserByFirebaseId(req.params.firebaseId);
    if (!user) return res.status(404).json({ message: 'User with provided Firebase ID not found.' });
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

async function registerUser(req: Request<{}, {}, User & { password: string }, {}>, res: Response<WithId<User> | MessageResponse>, next: NextFunction) {
  const { email, password, firstName, lastName } = req.body;
  try {
    const newFirebaseUser = await admin.auth.createUser({
      email,
      password,
    });

    
    if (newFirebaseUser) {
      const newUser = await UsersService.insertUser({ email, firstName, lastName, firebaseId: newFirebaseUser.uid });
      if (newUser) return res.status(201).json(newUser);
    }
  } catch (error) {
    if (error.code === 'auth/email-already-exists') res.statusCode = 409;
    next(error);
  }
}

export { getUserByFirebaseId, registerUser };