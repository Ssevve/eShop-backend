import { NextFunction, Request, Response } from 'express';
import { ObjectId, WithId } from 'mongodb';
import * as ReviewsService from './reviews.service';
import { Review, Reviews } from './reviews.model';
import MessageResponse from '../../types/MessageResponse';
import * as ProductsService from '../products/products.service';
import { client } from '../../db';
import { Product } from '../products/products.model';

async function getReviewsByProductId(req: Request<{ productId: string; }, {}, {}, {}>, res: Response<Review[]>, next: NextFunction) {
  try {
    const result = await Reviews.find({ productId: req.params.productId }).toArray();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

interface CreateReviewReqBody {
  rating: number;
  message: string;
  productId: string
}

type CreateReviewResBody = {
  created: {
    review: WithId<Review>;
  },
  updated: {
    product: Product;
  }
} | MessageResponse;

async function createReview(req: Request<{}, {}, CreateReviewReqBody, {}>, res: Response<CreateReviewResBody>, next: NextFunction) {
  const { message, productId, rating } = req.body;

  const duplicateReview = await Reviews.findOne({ userId: req.user._id, productId });
  if (duplicateReview) return res.status(409).json({ message: 'Duplicate review.' });
  
  const product = await ProductsService.findProductById(productId);
  if (!product) res.status(404).json({ message: 'Product with the given ID not found.' });
  
  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      const insertedReview = await ReviewsService.insertReview({ rating, message, productId, userFirstName: req.user.firstName, userId: req.user._id, session });
      const updatedProduct = await ProductsService.updateRating({ productId, session });
      if (insertedReview && updatedProduct) {
        return res.status(201).json({ created: { review: insertedReview }, updated: { product: updatedProduct } });
      } else {
        throw new Error('Transaction aborted. Review was not created.');
      }
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
}

type EditReviewReqParams = {
  reviewId: string;
  productId: string;
};

interface EditReviewReqBody {
  rating: number;
  message?: string;
}

type EditReviewResBody = {
  updated: {
    review: WithId<Review>;
    product: Product;
  }
} | MessageResponse;

async function editReview(req: Request<EditReviewReqParams, {}, EditReviewReqBody, {}>, res: Response<EditReviewResBody>, next: NextFunction) {
  const { message, rating } = req.body;
  const { reviewId, productId } = req.params;

  const review = await Reviews.findOne({ _id: new ObjectId(reviewId) });
  if (!review) return res.status(404).json({ message: 'Review with the given ID not found.' });

  const product = await ProductsService.findProductById(productId);
  if (!product) return res.status(404).json({ message: 'Product with the given ID not found.' });

  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      const updatedReview = await ReviewsService.updateReview({ id: reviewId, message, rating, session });
      const updatedProduct = await ProductsService.updateRating({ productId, session });
      if (updatedReview && updatedProduct) {
        return res.status(200).json({ updated: { review: updatedReview, product: updatedProduct } });
      } else {
        throw new Error('Transaction aborted. Nothing was changed.');
      }
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
}

export { getReviewsByProductId, createReview, editReview };