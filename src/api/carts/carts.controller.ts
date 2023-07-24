import { NextFunction, Request, Response } from 'express';
import { Document } from 'mongodb';
import * as CartsService from './carts.service';
import { UpdateCartByIdReqBody, UpdateCartByIdReqParams, UpdateCartByIdResBody } from './carts.types';

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

const addCartProduct = async (req: Request<UpdateCartByIdReqParams, {}, UpdateCartByIdReqBody, {}>, res: Response<UpdateCartByIdResBody>, next: NextFunction) => {
  const cart = await CartsService.findSingleByUserId(req.user._id);
  if (!cart) return res.status(404).json({ message: 'Cart not found.' });

  const { cartId } = req.params;
  if (cart._id.toString() !== cartId) return res.status(401).json({ message: 'You can not edit this cart!' });

  try {
    const { productId, quantity } = req.body;
    const updatedCart = await CartsService.updateSingle({ cartId, productId, quantity });
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

const updateCartProductQuantity = () => {};
const removeCartProduct = () => {};
const clearCart = () => {};


export {
  getCartByUserId,
  addCartProduct,
  updateCartProductQuantity,
  removeCartProduct,
  clearCart,
};

