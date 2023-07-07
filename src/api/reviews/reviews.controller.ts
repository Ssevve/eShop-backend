import { NextFunction, Request, Response } from 'express';
import * as ReviewsService from './reviews.service';
import { Review, Reviews } from './reviews.model';
import MessageResponse from '../../interfaces/MessageResponse';
import * as ProductsService from '../products/products.service';
import { client } from '../../db';
import { ObjectId } from 'mongodb';

async function getReviewsByProductId(req: Request<{ productId: string; }, {}, {}, {}>, res: Response<Review[]>, next: NextFunction) {
  try {
    const result = await Reviews.find({ productId: req.params.productId }).toArray();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function createReview(req: Request<{}, {}, { rating: number, message: string, productId: string }, {}>, res: Response<MessageResponse>, next: NextFunction) {
  const session = client.startSession();
  const { rating, message, productId } = req.body;
  try {
    const duplicateReview = await Reviews.findOne({ userId: req.user._id, productId });
    if (duplicateReview) return res.status(409).json({ message: 'Duplicate review' });

    const product = await ProductsService.findProductById(productId);
    if (!product) res.status(404).json({ message: 'Product with the given ID not found.' });

    await session.withTransaction(async () => {
      await ReviewsService.insertReview({ rating, message, productId, userFirstName: req.user?.firstName, userId: req.user?._id }, session);
      await ProductsService.updateRating({ productId, rating, isNew: true, session });
    });
    return res.sendStatus(201);
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
}

interface EditReviewByIdReqBody extends Review {
  _id: string;
}

async function editReview(req: Request<{}, {}, EditReviewByIdReqBody, {}>, res: Response<MessageResponse>, next: NextFunction) {
  const oldReview = await Reviews.findOne({ _id: new ObjectId(req.body._id) });
  if (!oldReview) return res.status(404).json({ message: 'Review with the given ID not found.' });

  const { _id: id, rating, message } = req.body;

  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      await ReviewsService.updateReview({ reviewId: id, rating, message, session });
      await ProductsService.updateRating({ productId: req.body.productId, rating, oldRating: oldReview.rating, session });      
      return res.sendStatus(200);
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
}

export { getReviewsByProductId, createReview, editReview };