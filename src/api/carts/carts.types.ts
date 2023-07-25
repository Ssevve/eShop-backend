import MessageResponse from '@/types/MessageResponse';
import { Document } from 'mongodb';

export type AddCartProductParams = {
  cartId: string;
};

export interface AddCartProductReqBody {
  productId: string;
  quantity: number;
}

export type AddCartProductResBody = Document | MessageResponse;

export interface UpdateSingleProductQuantityParams {
  cartId: string;
  productId: string;
  quantity: number;
}

export interface AddSingleProductParams {
  cartId: string;
  productId: string;
  quantity: number;
}

export interface RemoveSingleProductParams {
  cartId: string;
  productId: string;
}

export interface RemoveAllProductsParams {
  cartId: string;
}