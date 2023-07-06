import { ClientSession, ObjectId } from 'mongodb';
import { Review, Reviews } from './reviews.model';

const findReviewsByProductId = async (productId: string) => {
  const reviews = await Reviews.find({ productId }).toArray();
  return reviews;
};

const findReviewById = async (id: string) => {
  const review = await Reviews.findOne({ _id: new ObjectId(id) });
  return review;
};

const findDuplicateReview = async (productId: string, userId: string) => {
  const review = await Reviews.findOne({ userId, productId });
  return review;
};

const insertReview = async (review: Review, session: ClientSession) => {
  const result = await Reviews.insertOne(review, { session });
  const insertedReview = await Reviews.findOne({ _id: result.insertedId });
  return insertedReview;
};

interface UpdateReviewByIdArgs {
  id: string;
  rating: number;
  message: string;
  session: ClientSession;
}

const updateReviewById = async ({ id, rating, message, session }: UpdateReviewByIdArgs) => {
  const result = await Reviews.updateOne({ _id: new ObjectId(id) }, { $set: { rating, message } }, { session });
  return result;
};

export { findReviewsByProductId, findReviewById, findDuplicateReview, insertReview, updateReviewById };