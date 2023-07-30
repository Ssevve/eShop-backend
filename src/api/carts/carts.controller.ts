import { NextFunction, Request, Response } from 'express';
import { WithId } from 'mongodb';
import { Cart } from './carts.model';
import * as CartsService from './carts.service';
import { AddCartProductParams, AddCartProductReqBody, CartResBody, UpdateCartProductAmountParams, UpdateCartProductAmountReqBody } from './carts.types';

export const getCart = async (req: Request<{}, {}, {}, {}>, res: Response<WithId<Cart>>, next: NextFunction) => {
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
          const updatedCartFromCookie = await CartsService.updateUserId(cartFromCookie._id, req.user._id);
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

  const userId = req.user?._id;
  if (cart.userId?.toString() !== userId) return res.status(401).json({ message: 'You can not edit this cart!' });

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
  const cart = await CartsService.findSingleByUserId(req.user._id);
  if (!cart) return res.status(404).json({ message: 'Cart not found.' });

  try {
    const { cartId, productId } = req.params;
    const updatedCart = await CartsService.updateSingleProductAmount({ cartId, productId, amount: req.body.amount });
    res.status(200).json(updatedCart);
  } catch (error) {
    if (error instanceof RangeError) return res.status(400).json({ message: error.message });
    if (error instanceof ReferenceError) return res.status(404).json({ message: error.message });
    next(error);
  }
};
export const removeCartProduct = () => {};
export const clearCart = () => {};

// import { NextFunction, Request, Response } from 'express';
// import { Document, WithId } from 'mongodb';
// import * as CartsService from './carts.service';
// import { AddCartProductParams, AddCartProductReqBody, CartResBody, UpdateCartProductQuantityParams, UpdateCartProductQuantityReqBody } from './carts.types';
// import { productConstraints } from '@/lib/constants';
// import { Cart } from './carts.model';

// export const getCartByUserId = async (req: Request<{}, {}, {}, {}>, res: Response<Document>, next: NextFunction) => {
//   try {
//     const cart = await CartsService.findSingleByUserId(req.user._id);
//     console.log(cart);
//     // if (!cart) {
//     //   const newCart = await CartsService.createSingle(req.user._id);
//     //   if (!newCart) throw Error('Could not create cart.');
//     //   return res.status(200).json(newCart);
//     // }
    
//     res.status(200).json(cart);
//   } catch (error) {
//     next(error);
//   }
// };

// export const addCartProduct = async (req: Request<AddCartProductParams, {}, AddCartProductReqBody, {}>, res: Response<CartResBody>, next: NextFunction) => {
//   const cart = await CartsService.findSingleByUserId(req.user._id);
//   if (!cart) return res.status(404).json({ message: 'Cart not found.' });

//   const { cartId } = req.params;
//   if (cart._id.toString() !== cartId) return res.status(401).json({ message: 'You can not edit this cart!' });

//   try {
//     const updatedCart = await CartsService.updateCartProducts(cartId, newProducts);
//     res.status(200).json(updatedCart);
//   } catch (error) {
//     if (error instanceof RangeError) return res.status(400).json({ message: error.message });
//     if (error instanceof ReferenceError) return res.status(404).json({ message: error.message });
//     next(error);
//   }
// };

// export const updateCartProductQuantity = async (req: Request<UpdateCartProductQuantityParams, {}, UpdateCartProductQuantityReqBody, {}>, res: Response<CartResBody>, next: NextFunction) => {
//   const cart = await CartsService.findSingleByUserId(req.user._id);
//   if (!cart) return res.status(404).json({ message: 'Cart not found.' });

//   try {
//     const { cartId, productId } = req.params;
//     // const updatedCart = await CartsService.updateSingleProductQuantity({ cartId, productId, quantity: req.body.quantity });
//     // res.status(200).json(updatedCart);
//   } catch (error) {
//     if (error instanceof RangeError) return res.status(400).json({ message: error.message });
//     if (error instanceof ReferenceError) return res.status(404).json({ message: error.message });
//     next(error);
//   }
// };
// export const removeCartProduct = () => { };
// export const clearCart = () => { };

