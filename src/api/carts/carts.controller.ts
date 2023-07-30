import { NextFunction, Request, Response } from 'express';
import * as CartsService from './carts.service';
import { AddCartProductParams, AddCartProductReqBody, CartResBody, RemoveAllProductsParams, RemoveSingleProductParams, UpdateCartProductAmountParams, UpdateCartProductAmountReqBody } from './carts.types';

export const getCart = async (req: Request<{}, {}, {}, {}>, res: Response<CartResBody>, next: NextFunction) => {
  try {
    if (req.user) {
    // Registered user
      const userCart = await CartsService.findSingleByUserId(req.user._id);
      if (userCart) return res.status(200).json(userCart);

      // User has no cart in the DB, get cart from a cookie
      const cartIdFromCookie = req.cookies.cartId;
      if (cartIdFromCookie) {
        const cartFromCookie = await CartsService.findSingleById(cartIdFromCookie);
        if (cartFromCookie && !cartFromCookie.userId) {
          // Add user ID to the cart if it is not associated with any user
          const updatedCartFromCookie = await CartsService.updateUserId(cartFromCookie._id.toString(), req.user._id);
          if (!updatedCartFromCookie) throw Error('Could not update the cart.');
          res.cookie('cartId', updatedCartFromCookie._id);
          return res.status(201).json(updatedCartFromCookie);
        }
      }

      const newCart = await CartsService.createSingle(req.user._id);
      if (!newCart) throw Error('Could not create cart.');
      res.cookie('cartId', newCart._id);
      return res.status(201).json(newCart);
    }

    // Non registered user
    const cookieCartId = req.cookies.cartId;
    if (cookieCartId) {
    // Get the cart id from cookie and find the cart
      const cartFromCookie = await CartsService.findSingleById(cookieCartId);
      if (cartFromCookie && !cartFromCookie.userId) return res.status(200).json(cartFromCookie);
    }

    const newCart = await CartsService.createSingle();
    if (!newCart) throw Error('Could not create cart.');
    res.cookie('cartId', newCart._id);

    return res.status(200).json(newCart);
  } catch (error) {
    next(error);
  }
};

export const addCartProduct = async (req: Request<AddCartProductParams, {}, AddCartProductReqBody, {}>, res: Response<CartResBody>, next: NextFunction) => {
  const { cartId } = req.params;
  const cart = await CartsService.findSingleById(cartId);
  if (!cart) return res.status(404).json({ message: 'Cart not found.' });

  const userId = req.user?._id?.toString();
  if (cart.userId?.toString() !== userId) return res.status(401).json({ message: 'You cannot edit this cart!' });

  try {
    const { productId, amount } = req.body;
    const updatedCart = await CartsService.addSingleProduct({ cartId, productId, amount });
    res.status(200).json(updatedCart);
  } catch (error) {
    if (error instanceof RangeError) return res.status(400).json({ message: error.message });
    if (error instanceof ReferenceError) return res.status(404).json({ message: error.message });
    next(error);
  }
};

export const updateCartProductAmount = async (req: Request<UpdateCartProductAmountParams, {}, UpdateCartProductAmountReqBody, {}>, res: Response<CartResBody>, next: NextFunction) => {
  const { cartId, productId } = req.params;
  const cart = await CartsService.findSingleById(cartId);
  if (!cart) return res.status(404).json({ message: 'Cart not found.' });

  const userId = req.user?._id?.toString();
  if (cart.userId?.toString() !== userId) return res.status(401).json({ message: 'You cannot edit this cart!' });

  try {
    const updatedCart = await CartsService.updateSingleProductAmount({ cartId, productId, amount: req.body.amount });
    res.status(200).json(updatedCart);
  } catch (error) {
    if (error instanceof RangeError) return res.status(400).json({ message: error.message });
    if (error instanceof ReferenceError) return res.status(404).json({ message: error.message });
    next(error);
  }
};

export const removeCartProduct = async (req: Request<RemoveSingleProductParams, {}, {}, {}>, res: Response<CartResBody>, next: NextFunction) => {
  const { cartId, productId } = req.params;
  const cart = await CartsService.findSingleById(cartId);
  if (!cart) return res.status(404).json({ message: 'Cart not found.' });

  const userId = req.user?._id?.toString();
  if (cart.userId?.toString() !== userId) return res.status(401).json({ message: 'You cannot edit this cart!' });

  try {
    const updatedCart = await CartsService.removeSingleProduct({ cartId, productId });
    res.status(200).json(updatedCart);
  } catch (error) {
    if (error instanceof RangeError) return res.status(400).json({ message: error.message });
    if (error instanceof ReferenceError) return res.status(404).json({ message: error.message });
    next(error);
  }
};

export const clearCart = async (req: Request<RemoveAllProductsParams, {}, {}, {}>, res: Response<CartResBody>, next: NextFunction) => {
  const { cartId } = req.params;
  const cart = await CartsService.findSingleById(cartId);
  if (!cart) return res.status(404).json({ message: 'Cart not found.' });

  const userId = req.user?._id?.toString();
  if (cart.userId?.toString() !== userId) return res.status(401).json({ message: 'You cannot edit this cart!' });

  try {
    const updatedCart = await CartsService.removeAllProducts({ cartId });
    res.status(200).json(updatedCart);
  } catch (error) {
    if (error instanceof RangeError) return res.status(400).json({ message: error.message });
    if (error instanceof ReferenceError) return res.status(404).json({ message: error.message });
    next(error);
  }
};
