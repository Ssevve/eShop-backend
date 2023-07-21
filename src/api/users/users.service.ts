import admin from '@/firebaseConfig';
import { Users } from './users.model';
import { InsertSingleArgs } from './users.types';

const findSingleByFirebaseId = async (firebaseId: string) => {
  const user = await Users.findOne({ firebaseId });
  return user;
};

const insertSingle = async ({ email, password, firstName, lastName }: InsertSingleArgs) => {

  const newFirebaseUser = await admin.auth.createUser({
    email,
    password,
  });

  if (newFirebaseUser) {
    const insertResult = await Users.insertOne({ email, firstName, lastName, firebaseId: newFirebaseUser.uid });
    const newUser = await Users.findOne(insertResult.insertedId);
    return newUser;
  }

  return null;
};

export { findSingleByFirebaseId, insertSingle };
