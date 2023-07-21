import { ClientSession } from 'mongodb';
import { Product } from './products.model';

export interface Orders {
  asc: number;
  desc: number;
}

export interface QueryArguments {
  sort: string;
  order: number;
  skip: number;
  limit: number;
  category?: string;
}

export interface UpdateRatingArgs {
  productId: string;
  session: ClientSession;
}

export interface GetProductByIdReqParams {
  id: string;
}
export interface GetProductsReqQuery {
  page: string;
  limit: string;
  category: string;
  sort: string;
  order: string;
}
export interface GetProductsResBody {
  totalResults: number;
  products: Product[];
  productsPerPage: number;
}