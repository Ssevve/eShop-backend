import { Product } from './products.model';

export interface Orders {
  asc: number;
  desc: number;
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