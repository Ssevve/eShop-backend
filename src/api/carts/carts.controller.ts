import { NextFunction, Request, Response } from 'express';
import * as CartsService from './carts.service';
import { CartProduct } from './carts.model';
import { Document } from 'mongodb';
import MessageResponse from '@/types/MessageResponse';

const getCartByUserId = async (req: Request<{}, {}, {}, {}>, res: Response<Document>, next: NextFunction) => {
  try {
    const cart = await CartsService.findSingleByUserId(req.user._id);

    if (!cart) {
      const newCart = await CartsService.createSingle(req.user._id);
      if (!newCart) throw Error('Could not create cart.');
      return res.status(200).json(newCart);
    }
    
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const updateCartById = async (req: Request<{ cartId: string }, {}, { products: CartProduct[] }, {}>, res: Response<Document | MessageResponse>, next: NextFunction) => {
  const { cartId } = req.params;
  const cart = await CartsService.findSingleByUserId(req.user._id);
  if (!cart) return res.status(404).json({ message: 'Cart not found.' });
  if (cart._id.toString() !== cartId) return res.status(401).json({ message: 'You can not edit this cart!' });

  try {
    const updatedCart = await CartsService.updateSingle(cartId, req.body.products);
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

export { getCartByUserId, updateCartById };