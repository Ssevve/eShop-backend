import MessageResponse from '@/types/MessageResponse';
import { Document } from 'mongodb';

export type UpdateCartByIdReqParams = {
  cartId: string;
};

export interface UpdateCartByIdReqBody {
  productId: string;
  quantity: number;
}

export type UpdateCartByIdResBody = Document | MessageResponse;

export interface AddSingleProductParams {
  cartId: string;
  productId: string;
  quantity: number;
}

export interface UpdateSingleProductQuantityParams {
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