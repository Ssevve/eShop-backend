import MessageResponse from '@/types/MessageResponse';
import { ObjectId } from 'mongodb';

export type AddCartProductParams = {
  cartId: string;
};

export interface AddCartProductReqBody {
  productId: string;
  amount: number;
}

export type UpdateCartProductAmountParams = {
  cartId: string;
  productId: string;
};
export interface UpdateCartProductAmountReqBody {
  amount: number;
}

interface ResponseCartProduct {
  amount: number;
  product: {
    _id: ObjectId;
    name: string;
    discountPrice: number;
    price: number;
    imageUrl: string;
    quantity: string;
  }
}

export type ResponseCart = {
  _id: ObjectId;
  userId: ObjectId | null;
  products: ResponseCartProduct[];
  createdAt: Date;
  updatedAt?: Date;
};

export type CartResBody = ResponseCart | MessageResponse;

export interface UpdateSingleProductAmountParams {
  cartId: string;
  productId: string;
  amount: number;
}

export interface AddSingleProductParams {
  cartId: string;
  productId: string;
  amount: number;
}

export interface RemoveSingleProductParams {
  cartId: string;
  productId: string;
}

export interface RemoveAllProductsParams {
  cartId: string;
}