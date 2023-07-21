import MessageResponse from '@/types/MessageResponse';
import { WithId } from 'mongodb';
import { Product } from '../products/products.model';
import { Review } from './reviews.model';

export interface InsertReviewArgs {
  rating: number;
  message?: string;
  productId: string;
  userId: string;
  userFirstName: string;
}

export interface UpdateReviewByIdArgs {
  id: string;
  rating: number;
  productId: string;
  message?: string;
}

export interface GetReviewsByProductIdReqParams {
  productId: string;
}

export interface GetReviewsByUserIdReqParams {
  userId: string;
}

export type EditReviewReqParams = {
  reviewId: string;
  productId: string;
};

export interface EditReviewReqBody {
  rating: number;
  message?: string;
}

export type EditReviewResBody = {
  updated: {
    review: WithId<Review>;
    product: Product;
  }
} | MessageResponse;

export interface CreateReviewReqBody {
  rating: number;
  message: string;
  productId: string;
}

export type CreateReviewResBody = {
  created: {
    review: WithId<Review>;
  },
  updated: {
    product: Product;
  }
} | MessageResponse;