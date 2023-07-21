import categories from '@/data/categories';
import MessageResponse from '@/types/MessageResponse';
import { NextFunction, Request, Response } from 'express';
import { Product } from './products.model';
import * as ProductsService from './products.service';
import { GetProductByIdReqParams, GetProductsReqQuery, GetProductsResBody, Orders } from './products.types';

const getProductById = async (req: Request<GetProductByIdReqParams, {}, {}, {}>, res: Response<Product | MessageResponse>, next: NextFunction) => {
  try {
    const product = await ProductsService.findSingleById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req: Request<{}, {}, {}, GetProductsReqQuery>, res: Response<GetProductsResBody>, next: NextFunction) => {

  const DEFAULT_SORT = '_id';
  const possibleSorts = ['name', 'discountPrice'];
  
  const DEFAULT_ORDER = 1;
  const possibleOrders: Orders = {
    asc: 1,
    desc: -1,
  };
  
  const { category, page } = req.query;

  const PRODUCTS_PER_PAGE = 20;
  const sort = possibleSorts.includes(req.query.sort) ? req.query.sort : DEFAULT_SORT;
  const order =  possibleOrders[req.query.order as keyof Orders] || DEFAULT_ORDER;
  const skip = (parseInt(page) - 1) * PRODUCTS_PER_PAGE || 0;

  try {
    let results: Omit<GetProductsResBody, 'productsPerPage'>;
    if (category === 'Discounts') {
      results = await ProductsService.findAllDiscounted({ limit: PRODUCTS_PER_PAGE, skip, sort, order });
    } else if (categories.includes(category)) {
      results = await ProductsService.findAllByCategory({ category, limit: PRODUCTS_PER_PAGE, skip, sort, order });
    } else {
      results = await ProductsService.findAll({ sort, order, skip, limit: PRODUCTS_PER_PAGE });
    }

    res.status(200).json({ ...results, productsPerPage: PRODUCTS_PER_PAGE });
  } catch (error) {
    next(error);
  }
};

export { getProductById, getProducts };

