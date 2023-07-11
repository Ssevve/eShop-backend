import { NextFunction, Request, Response } from 'express';
import * as ReviewsService from './reviews.service';
import { Review, Reviews } from './reviews.model';
import MessageResponse from '../../types/MessageResponse';
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

interface CreateReviewReqBody {
  rating: number | string;
  message: string;
  productId: string
}

type CreateReviewResBody = Review & { _id: string } | MessageResponse;

async function createReview(req: Request<{}, {}, CreateReviewReqBody, {}>, res: Response<CreateReviewResBody>, next: NextFunction) {
  const { message, productId } = req.body;
  if (!productId) return res.status(400).json({ message: 'Product id missing.' });

  const rating = Number(req.body.rating);
  if (!rating) return res.status(400).json({ message: 'Rating is required.' });
  // TODO: extract values
  if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5.' });

  const session = client.startSession();
  try {
    const duplicateReview = await Reviews.findOne({ userId: req.user._id, productId });
    if (duplicateReview) return res.status(409).json({ message: 'Duplicate review' });

    const product = await ProductsService.findProductById(productId);
    if (!product) res.status(404).json({ message: 'Product with the given ID not found.' });

    await session.withTransaction(async () => {
      await ReviewsService.insertReview({ rating, message, productId, userFirstName: req.user?.firstName, userId: req.user?._id }, session);
      await ProductsService.updateRating({ productId, rating, isNew: true, session });
    });

    const createdReview = await Reviews.findOne({ userId: req.user._id, productId });
    if (createdReview) return res.status(201).json(createdReview);
    else throw new Error('Could not find created review.');
    
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
}

interface EditReviewByIdReqBody {
  _id: string;
  rating: number;
  message?: string;
}

type EditReviewByIdResBody = Review | MessageResponse;

async function editReview(req: Request<{}, {}, EditReviewByIdReqBody, {}>, res: Response<EditReviewByIdResBody>, next: NextFunction) {
  const { _id: id, message } = req.body;
  if (!id) return res.status(400).json({ message: 'Review id missing.' });

  const rating = Number(req.body.rating);
  if (!rating) return res.status(400).json({ message: 'Rating is required.' });
  // TODO: extract values
  if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5.' });

  const session = client.startSession();
  try {
    const oldReview = await Reviews.findOne({ _id: new ObjectId(id) });
    if (!oldReview) return res.status(404).json({ message: 'Review with the given ID not found.' });

    await session.withTransaction(async () => {
      await ReviewsService.updateReview({ id, rating, message, session });
      await ProductsService.updateRating({ productId: oldReview.productId, rating, oldRating: oldReview.rating, session });      
    });

    const updatedReview = await Reviews.findOne({ _id: new ObjectId(id) });
    if (updatedReview) return res.status(200).json(updatedReview);
    else throw new Error('Could not find updated review.');

  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
}

export { getReviewsByProductId, createReview, editReview };