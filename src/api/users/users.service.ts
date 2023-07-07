import { User, Users } from './users.model';

const findUserByFirebaseId = async (firebaseId: string) => {
  const user = await Users.findOne({ firebaseId });
  return user;
};

const insertUser = async (user: User) => {
  await Users.insertOne(user);
  const insertedUser = await findUserByFirebaseId(user.firebaseId);
  return insertedUser;
};

export { findUserByFirebaseId, insertUser };