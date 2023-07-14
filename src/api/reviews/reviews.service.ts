import { ClientSession, ObjectId } from 'mongodb';
import { Reviews } from './reviews.model';

interface InsertReviewArgs {
  rating: number;
  message: string;
  productId: string;
  userId: string;
  userFirstName: string;
  session: ClientSession;
}

const insertReview = async ({ rating, message, productId, userId, userFirstName, session }: InsertReviewArgs) => {
  const result = await Reviews.insertOne(
    {
      rating,
      message,
      productId: new ObjectId(productId),
      userId: new ObjectId(userId),
      userFirstName,
    },
    { session });
  const insertedReview = await Reviews.findOne({ _id: result.insertedId }, { session });
  return insertedReview;
};

interface UpdateReviewByIdArgs {
  id: string;
  rating: number;
  message?: string;
  session: ClientSession;
}

const updateReview = async ({ id, rating, message, session }: UpdateReviewByIdArgs) => {
  if (message) {
    await Reviews.updateOne({ _id: new ObjectId(id) }, { $set: { rating, message } }, { session });
  } else {
    await Reviews.updateOne({ _id: new ObjectId(id) }, { $set: { rating } }, { session });
  }
  const updatedReview = await Reviews.findOne({ _id: new ObjectId(id) }, { session });
  return updatedReview;
};

export { insertReview, updateReview };