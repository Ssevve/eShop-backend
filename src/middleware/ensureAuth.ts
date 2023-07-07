import { NextFunction, Request, Response } from 'express';
import admin from '../firebaseConfig';
import { findUserByFirebaseId } from '../api/users/users.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function ensureAuth(req: Request, res: Response, next: NextFunction) {
  const firebaseToken = req.headers.authorization?.split(' ')[1];
  if (!firebaseToken) return res.sendStatus(401);

  const firebaseUser = await admin.auth.verifyIdToken(firebaseToken);
  if (!firebaseUser) return res.sendStatus(401);

  const user = await findUserByFirebaseId(firebaseUser.uid);

  console.log(user);

  // @ts-ignore
  req.user = user;
  next();
}

export default ensureAuth;