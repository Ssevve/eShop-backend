import { NextFunction, Request, Response } from 'express';
import categories from '../../data/categories';
import { SortDirection } from 'mongodb';
import * as ProductsService from './products.service';
import { Product } from './products.model';

interface GetProductByIdReqParams {
  id: string;
}

async function getProductById(req: Request<GetProductByIdReqParams, {}, {}, {}>, res: Response<Product | null>, next: NextFunction) {
  try {
    const result = await ProductsService.findProductById(req.params.id);
    if (!result) return res.status(404).json(null);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

interface GetProductsReqQuery {
  page: string;
  limit: string;
  category: string;
  sort: string;
  order: string;
}

interface GetProductsResBody {
  totalResults: number;
  products: Product[];
  productsPerPage: number;
}

async function getProducts(req: Request<{}, {}, {}, GetProductsReqQuery>, res: Response<GetProductsResBody>, next: NextFunction) {
  try {
    const PRODUCTS_PER_PAGE = 20;
    const { category, sort } = req.query;
    const order = parseInt(req.query.order) as SortDirection;
    const page = parseInt(req.query.page);
    const skip = (page - 1) * PRODUCTS_PER_PAGE || 0;

    let products: Product[];
    let totalResults: number;
    if (category === 'Discounts') {
      const result = await ProductsService.findDiscountedProducts({ limit: PRODUCTS_PER_PAGE, skip, sort, order });
      products = result.products;
      totalResults = result.totalResults;
    } else if (categories.includes(category)) {
      const result = await ProductsService.findProductsByCategory({ category, limit: PRODUCTS_PER_PAGE, skip, sort, order });
      products = result.products;
      totalResults = result.totalResults;
    } else {
      const result = await ProductsService.findAllProducts({ sort, order, skip, limit: PRODUCTS_PER_PAGE });
      products = result.products;
      totalResults = result.totalResults;
    }

    res.status(200).json({ totalResults, products, productsPerPage: PRODUCTS_PER_PAGE });
  } catch (error) {
    next(error);
  }
}

export { getProductById, getProducts };