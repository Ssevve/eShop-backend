import * as ProductsService from '@/api/products/products.service';
import { client } from '@/db';
import { ObjectId } from 'mongodb';
import { Reviews } from './reviews.model';
import { InsertReviewArgs, UpdateReviewByIdArgs } from './reviews.types';

const findSingleById = async (id: string) => {
  const review = await Reviews.findOne(new ObjectId(id));
  return review;
};

const findAllByProductId = async (productId: string) => {
  const reviews = await Reviews.find({ productId: new ObjectId(productId) }).toArray();
  return reviews;
};

const findAllByUserId = async (userId: string) => {
  const reviews = await Reviews.find({ userId: new ObjectId(userId) }).toArray();
  return reviews;
};

const findDuplicate = async (userId: string, productId: string) => {
  const review = await Reviews.findOne({ userId: new ObjectId(userId), productId: new ObjectId(productId) });
  return review;
};

const createSingle = async ({ rating, message, productId, userId, userFirstName }: InsertReviewArgs) => {
  const session = client.startSession();

  let creationResults;
  await session.withTransaction(async () => {
    const insertReviewResult = await Reviews.insertOne({
      rating,
      message: message || '',
      productId: new ObjectId(productId),
      userId: new ObjectId(userId),
      userFirstName: userFirstName,
      createdAt: new Date(),
    },
    { session });
    if (!insertReviewResult.insertedId) {
      session.abortTransaction();
      return;
    }

    const product = await ProductsService.updateRating({ productId, session });
    if (!product) {
      session.abortTransaction();
      return;
    }
    
    const review = await Reviews.findOne(insertReviewResult.insertedId, { session });
    creationResults = { created: { review }, updated: { product } };
    session.commitTransaction();
  });
  
  return creationResults;
};

const updateSingle = async ({ id, rating, message, productId }: UpdateReviewByIdArgs) => {
  const session = client.startSession();

  let updateResults;
  await session.withTransaction(async () => {
    const updateReviewResult = await Reviews.updateOne({ _id: new ObjectId(id) }, { $set: { rating, message, updatedAt: new Date() } }, { session });
    if (updateReviewResult.modifiedCount !== 1) {
      session.abortTransaction();
      return;
    }

    const product = await ProductsService.updateRating({ productId, session });
    if (!product) {
      session.abortTransaction();
      return;
    }
    
    const review = await Reviews.findOne(new ObjectId(id), { session });
    updateResults = { updated: { review, product } };
    session.commitTransaction();
  });
  
  return updateResults;
};

export { createSingle, findAllByProductId, findAllByUserId, findDuplicate, findSingleById, updateSingle };

