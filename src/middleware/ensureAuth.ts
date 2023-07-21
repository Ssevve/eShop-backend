import { NextFunction, Request, Response } from 'express';
import admin from '@/firebaseConfig';
import { findSingleByFirebaseId } from '@/api/users/users.service';
import FirebaseErrors from '@/lib/firebaseErrors';

async function ensureAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const firebaseToken = req.headers.authorization?.split(' ')[1];
    if (!firebaseToken) return res.sendStatus(401);
  
    const firebaseUser = await admin.auth.verifyIdToken(firebaseToken);
    if (!firebaseUser) return res.sendStatus(401);
  
    const user = await findSingleByFirebaseId(firebaseUser.uid);
  
    req.user = user;
    next();
  } catch (error) {
    if (error.code === FirebaseErrors.ExpiredToken) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    next(error);
  }
}

export default ensureAuth;