import categories from '@/data/categories';
import MessageResponse from '@/types/MessageResponse';
import { NextFunction, Request, Response } from 'express';
import { Product } from './products.model';
import * as ProductsService from './products.service';
import { GetProductByIdReqParams, GetProductsReqQuery, GetProductsResBody, Orders } from './products.types';

async function getProductById(req: Request<GetProductByIdReqParams, {}, {}, {}>, res: Response<Product | MessageResponse>, next: NextFunction) {
  try {
    const result = await ProductsService.findProductById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Product not found.' });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getProducts(req: Request<{}, {}, {}, GetProductsReqQuery>, res: Response<GetProductsResBody>, next: NextFunction) {

  const DEFAULT_SORT = '_id';
  const possibleSorts = ['name', 'discountPrice'];
  
  const DEFAULT_ORDER = 1;
  const possibleOrders: Orders = {
    asc: 1,
    desc: -1,
  };
  
  const PRODUCTS_PER_PAGE = 20;
  const category = req.query.category;
  const sort = possibleSorts.includes(req.query.sort) ? req.query.sort : DEFAULT_SORT;
  const order =  possibleOrders[req.query.order as keyof Orders] || DEFAULT_ORDER;
  const skip = (parseInt(req.query.page) - 1) * PRODUCTS_PER_PAGE || 0;

  try {
    let result: Omit<GetProductsResBody, 'productsPerPage'>;
    if (category === 'Discounts') {
      result = await ProductsService.findDiscountedProducts({ limit: PRODUCTS_PER_PAGE, skip, sort, order });
    } else if (categories.includes(category)) {
      result = await ProductsService.findProductsByCategory({ category, limit: PRODUCTS_PER_PAGE, skip, sort, order });
    } else {
      result = await ProductsService.findAllProducts({ sort, order, skip, limit: PRODUCTS_PER_PAGE });
    }

    res.status(200).json({ ...result, productsPerPage: PRODUCTS_PER_PAGE });
  } catch (error) {
    next(error);
  }
}

export { getProductById, getProducts };

