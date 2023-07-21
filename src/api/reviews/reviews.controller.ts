import { NextFunction, Request, Response } from 'express';
import * as ProductsService from '../products/products.service';
import { Review } from './reviews.model';
import * as ReviewsService from './reviews.service';
import { CreateReviewReqBody, CreateReviewResBody, EditReviewReqBody, EditReviewReqParams, EditReviewResBody, GetReviewsByProductIdReqParams, GetReviewsByUserIdReqParams } from './reviews.types';

const getReviewsByProductId = async (req: Request<GetReviewsByProductIdReqParams, {}, {}, {}>, res: Response<Review[]>, next: NextFunction) => {
  try {
    const reviews = await ReviewsService.findAllByProductId(req.params.productId);
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

const getReviewsByUserId = async (req: Request<GetReviewsByUserIdReqParams, {}, {}, {}>, res: Response<Review[]>, next: NextFunction) => {
  try {
    const reviews = await ReviewsService.findAllByUserId(req.params.userId);
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

const createReview = async (req: Request<{}, {}, CreateReviewReqBody, {}>, res: Response<CreateReviewResBody>, next: NextFunction) => {
  const { message, productId, rating } = req.body;
  const { firstName: userFirstName, _id: userId } = req.user;

  const duplicate = await ReviewsService.findDuplicate(userId, productId);
  if (duplicate) return res.status(409).json({ message: 'Duplicate review.' });
  
  const product = await ProductsService.findSingleById(productId);
  if (!product) res.status(404).json({ message: 'Product with the given ID not found.' });
  try {
    const results = await ReviewsService.createSingle({ rating, message, productId, userFirstName, userId });
    return res.status(201).json(results);
  } catch (error) {
    next(error);
  }
};

const editReview = async (req: Request<EditReviewReqParams, {}, EditReviewReqBody, {}>, res: Response<EditReviewResBody | void>, next: NextFunction) => {
  const { message, rating } = req.body;
  const { reviewId, productId } = req.params;

  const review = await ReviewsService.findSingleById(reviewId);
  if (!review) return res.status(404).json({ message: 'Review with the given ID not found.' });

  const product = await ProductsService.findSingleById(productId);
  if (!product) return res.status(404).json({ message: 'Product with the given ID not found.' });

  try {
    const results = await ReviewsService.updateSingle({ id: reviewId, rating, message, productId });
    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

export { createReview, editReview, getReviewsByProductId, getReviewsByUserId };

