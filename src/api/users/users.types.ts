import MessageResponse from '@/types/MessageResponse';
import { WithId } from 'mongodb';
import { User } from './users.model';

export interface GetUserByFirebaseIdParams {
  firebaseId: string;
}

export type RegisterUserResBody = WithId<User> | MessageResponse;

export interface RegisterUserReqBody extends User {
  password: string;
}

export interface InsertSingleArgs {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}