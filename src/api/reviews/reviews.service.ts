import { ClientSession, ObjectId } from 'mongodb';
import { Reviews } from './reviews.model';

const insertReview = async ({ rating, message, productId, userId, userFirstName }: { rating: number; message: string; productId: string, userId: string, userFirstName: string }, session: ClientSession) => {
  const result = await Reviews.insertOne({ rating, message, productId, userId, userFirstName }, { session });
  const insertedReview = await Reviews.findOne({ _id: result.insertedId });
  return insertedReview;
};

interface UpdateReviewByIdArgs {
  reviewId: string;
  rating: number;
  message: string;
  session: ClientSession;
}

const updateReview = async ({ reviewId, rating, message, session }: UpdateReviewByIdArgs) => {
  const result = await Reviews.updateOne({ _id: new ObjectId(reviewId) }, { $set: { rating, message } }, { session });
  return result;
};

export { insertReview, updateReview };