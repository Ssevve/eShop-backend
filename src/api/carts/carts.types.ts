import MessageResponse from '@/types/MessageResponse';
import { WithId } from 'mongodb';
import { Cart } from './carts.model';

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
export type CartResBody = WithId<Cart> | MessageResponse;

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