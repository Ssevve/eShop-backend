import { NextFunction, Request, Response } from 'express';
import { Document } from 'mongodb';
import * as CartsService from './carts.service';
import { UpdateCartByIdReqBody, UpdateCartByIdReqParams, UpdateCartByIdResBody } from './carts.types';

export const getCartByUserId = async (req: Request<{}, {}, {}, {}>, res: Response<Document>, next: NextFunction) => {
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

export const addCartProduct = async (req: Request<UpdateCartByIdReqParams, {}, UpdateCartByIdReqBody, {}>, res: Response<UpdateCartByIdResBody>, next: NextFunction) => {
  const cart = await CartsService.findSingleByUserId(req.user._id);
  if (!cart) return res.status(404).json({ message: 'Cart not found.' });

  const { cartId } = req.params;
  if (cart._id.toString() !== cartId) return res.status(401).json({ message: 'You can not edit this cart!' });

  try {
    const { productId, quantity } = req.body;
    const updatedCart = await CartsService.addSingleProduct({ cartId, productId, quantity });
    res.status(200).json(updatedCart);
  } catch (error) {
    if (error instanceof RangeError) return res.status(400).json({ message: error.message });
    if (error instanceof ReferenceError) return res.status(404).json({ message: error.message });
    next(error);
  }
};

export const updateCartProductQuantity = () => {};
export const removeCartProduct = () => {};
export const clearCart = () => {};

