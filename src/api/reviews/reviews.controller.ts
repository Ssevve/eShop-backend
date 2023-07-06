import { NextFunction, Request, Response } from 'express';
import * as ReviewsService from './reviews.service';
import { Review } from './reviews.model';
import MessageResponse from '../../interfaces/MessageResponse';
import * as ProductsService from '../products/products.service';
import { client } from '../../db';

interface GetReviewsByProductIdReqParams {
  productId: string;
}

async function getReviewsByProductId(req: Request<GetReviewsByProductIdReqParams, {}, {}, {}>, res: Response<Review[]>, next: NextFunction) {
  try {
    const result = (await ReviewsService.findReviewsByProductId(req.params.productId));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function createReview(req: Request<{}, {}, Review, {}>, res: Response<MessageResponse>, next: NextFunction) {
  const session = client.startSession();
  try {
    const duplicateReview = await ReviewsService.findDuplicateReview(req.body.productId, req.body.userId);
    if (duplicateReview) return res.status(409).json({ message: 'Duplicate review' });

    await session.withTransaction(async () => {
      await ReviewsService.insertReview(req.body, session);
      await ProductsService.updateRatingById({ productId: req.body.productId, rating: req.body.rating, isNew: true, session });      
      return res.sendStatus(201);
    });

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
  const oldReview = await ReviewsService.findReviewById(req.body._id);
  if (!oldReview) return res.status(404).json({ message: 'Review with the given ID not found.' });

  const { _id: id, rating, message } = req.body;

  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      await ReviewsService.updateReviewById({ id, rating, message, session });
      await ProductsService.updateRatingById({ productId: req.body.productId, rating, oldRating: oldReview.rating, session });      
      return res.sendStatus(200);
    });

  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
}

export { getReviewsByProductId, createReview, editReview };