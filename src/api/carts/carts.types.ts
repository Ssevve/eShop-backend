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


export interface UpdateSingleCartParams {
  cartId: string;
  productId: string;
  quantity: number;
}