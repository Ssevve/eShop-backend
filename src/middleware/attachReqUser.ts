import { NextFunction, Request, Response } from 'express';
import admin from '@/firebaseConfig';
import { findSingleByFirebaseId } from '@/api/users/users.service';
import FirebaseErrors from '@/lib/firebaseErrors';

async function attachReqUser(req: Request, res: Response, next: NextFunction) {
  try {
    const firebaseToken = req.headers.authorization?.split(' ')[1];
    if (!firebaseToken) {
      req.user = null;
      return next();
    }
  
    const firebaseUser = await admin.auth.verifyIdToken(firebaseToken);
    if (!firebaseUser) {
      req.user = null;
      return next();
    }
    const user = await findSingleByFirebaseId(firebaseUser.uid);
  
    req.user = user;
    next();
  } catch (error) {
    if (error.code === FirebaseErrors.ExpiredToken) {
      req.user = null;
      return next();
    }
    next(error);
  }
}

export default attachReqUser;