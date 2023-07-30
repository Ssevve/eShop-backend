import cartAggregationPipeline from './aggregations/cartAggregationPipeline';
import { Cart, Carts } from './carts.model';
import { RemoveAllProductsParams,
  RemoveSingleProductParams,
  UpdateSingleProductAmountParams,
  AddSingleProductParams,
} from './carts.types';
import { productConstraints } from '@/lib/constants';
import aggregateWithCartId from './aggregations/aggregateWithCartId';
import { ObjectId, WithId } from 'mongodb';

export const findSingleById = async (cartId: string | ObjectId) => {
  return aggregateWithCartId(cartId);
};

export const findSingleByUserId = async (userId: string | ObjectId) => {
  const cartAggregationResults = await Carts.aggregate<WithId<Cart>>([
    {
      $match: {
        userId: new ObjectId(userId),
      },
    },
    ...cartAggregationPipeline,
  ]).toArray();

  return cartAggregationResults[0];
};

export const createSingle = async (userId?: string) => {
  const insertResult = await Carts.insertOne({
    userId: userId ? new ObjectId(userId) : null,
    products: [],
    createdAt: new Date(),
  });

  const cart = await Carts.findOne(insertResult.insertedId);
  return cart;
};

export const updateUserId = async (cartId: ObjectId, userId: string) => {
  const updateResult = await Carts.updateOne({ _id: cartId },
    { 
      $set:
      { 
        'userId': new ObjectId(userId),
        'updatedAt': new Date(),
      },
    });
  if (!updateResult.modifiedCount) throw Error('Failed to update the cart.');
  return aggregateWithCartId(cartId);
};

export const addSingleProduct = async ({ cartId, productId, amount }: AddSingleProductParams) => {
  const cartObjectId = new ObjectId(cartId);
  const cart = await Carts.findOne(cartObjectId);
  if (!cart) throw ReferenceError('Cart not found.');

  const newProduct = {
    productId: new ObjectId(productId),
    amount,
  };

  const duplicate = cart.products.find((product) => product.productId.toString() === productId);
  if (duplicate) {
    const newAmount = amount += duplicate.amount;
    if (newAmount < productConstraints.amount.min 
      || newAmount > productConstraints.amount.max) {
      throw RangeError('Invalid amount.');
    }
    newProduct.amount = newAmount;
  }

  const newProducts = cart.products.filter((product) => product.productId.toString() !== productId);
  newProducts.push(newProduct);

  const updateResult = await Carts.updateOne({ _id: cartObjectId },
    { 
      $set: 
      { 
        'products': newProducts,
        'updatedAt': new Date(),
      },
    });
  if (!updateResult.modifiedCount) throw Error('Failed to update the cart.');

  return aggregateWithCartId(cartId);
};

export const updateSingleProductAmount = async ({ cartId, productId, amount }: UpdateSingleProductAmountParams) => {
  const cartObjectId = new ObjectId(cartId);
  const cart = await Carts.findOne(cartObjectId);
  if (!cart) throw ReferenceError('Cart not found.');
  
  const product = cart.products.find((prod) => prod.productId.toString() === productId);
  if (product) product.amount = amount;

  const updateResult = await Carts.updateOne({ _id: cartObjectId },
    { 
      $set:
      { 
        'products': cart.products,
        'updatedAt': new Date(),
      },
    });
  if (!updateResult.modifiedCount) throw Error('Failed to update the cart.');
  
  return aggregateWithCartId(cartId);
};

export const removeSingleProduct = async ({ cartId, productId }: RemoveSingleProductParams) => {
  const cartObjectId = new ObjectId(cartId);
  const cart = await Carts.findOne(cartObjectId);
  const updateResult = await Carts.updateOne({ _id: cartObjectId },
    { 
      $set: 
      { 
        'products': cart?.products.filter((product) => product.productId.toString() !== productId),
        'updatedAt': new Date(),
      },
    });
  if (!updateResult.modifiedCount) throw Error('Failed to update the cart.');
  return aggregateWithCartId(cartId);
};

export const removeAllProducts = async ({ cartId }: RemoveAllProductsParams) => {
  const cartObjectId = new ObjectId(cartId);
  const updateResult = await Carts.updateOne({ _id: cartObjectId },
    { 
      $set: 
      { 
        'products': [],
        'updatedAt': new Date(),
      },
    });
  if (!updateResult.modifiedCount) throw Error('Failed to update the cart.');
  const cart = await Carts.findOne(cartObjectId);
  return cart;
};

// export { createSingle, findSingleByUserId, addSingleProduct, updateSingleProductAmount, removeSingleProduct, removeAllProducts };



// import { ObjectId, WithId } from 'mongodb';
// import cartAggregationPipeline from './aggregations/cartAggregationPipeline';
// import { Cart, Carts } from './carts.model';
// import { RemoveAllProductsParams,
//   RemoveSingleProductParams,
// } from './carts.types';
// import aggregateWithCartId from './aggregations/aggregateWithCartId';
// import { User } from '../users/users.model';

// export const findSingleByUserId = async (userId: ObjectId) => {
//   console.log(userId);
//   const cartAggregationResults = await Carts.aggregate<WithId<Cart>>([
//     {
//       $match: {
//         'userId': userId.toString(),
//       },
//     },
//     ...cartAggregationPipeline, 
//   ]).toArray();

//   return cartAggregationResults[0];
// };

// const createSingle = async (userId: string) => {
//   const insertResult = await Carts.insertOne({
//     userId: new ObjectId(userId),
//     products: [],
//     createdAt: new Date(),
//   });

//   const cart = await Carts.findOne(insertResult.insertedId);
//   return cart;
// };

// const addSingleProduct = async ({ cartId, productId, quantity }: AddSingleProductParams) => {
//   const cartObjectId = new ObjectId(cartId);
//   const cart = await Carts.findOne(cartObjectId);
//   if (!cart) throw ReferenceError('Cart not found.');



  

//   const updateResult = await Carts.updateOne({ _id: cartObjectId },
//     { 
//       $set: 
//       { 
//         'products': newProducts,
//         'updatedAt': new Date(),
//       },
//     });
//   if (!updateResult.modifiedCount) throw Error('Failed to update the cart.');

//   return aggregateWithCartId(cartId);
// };

// export const updateCartProducts = async (cartId: any, products: any) => {
//   const updateResult = await Carts.updateOne({ _id: new ObjectId(cartId) },
//     { 
//       $set:
//       { 
//         'products': products,
//         'updatedAt': new Date(),
//       },
//     });
//   if (!updateResult.modifiedCount) throw Error('Failed to update the cart.');
  
//   return aggregateWithCartId(cartId);
// };

// const updateSingleProductQuantity = async ({ cartId, productId, quantity }: UpdateSingleProductQuantityParams) => {
  
  
//   const product = cart.products.find((prod) => prod.productId.toString() === productId);
//   if (product) product.quantity = quantity;

//   await updateCartProducts();
// };

// const removeSingleProduct = async ({ cartId, productId }: RemoveSingleProductParams) => {
//   const cartObjectId = new ObjectId(cartId);
//   const cart = await Carts.findOne(cartObjectId);
//   const updateResult = await Carts.updateOne({ _id: cartObjectId },
//     { 
//       $set: 
//       { 
//         'products': cart?.products.filter((product) => product.productId.toString() !== productId),
//         'updatedAt': new Date(),
//       },
//     });
//   if (!updateResult.modifiedCount) throw Error('Failed to update the cart.');
//   return aggregateWithCartId(cartId);
// };

// const removeAllProducts = async ({ cartId }: RemoveAllProductsParams) => {
//   const cartObjectId = new ObjectId(cartId);
//   const updateResult = await Carts.updateOne({ _id: cartObjectId },
//     { 
//       $set: 
//       { 
//         'products': [],
//         'updatedAt': new Date(),
//       },
//     });
//   if (!updateResult.modifiedCount) throw Error('Failed to update the cart.');
//   const cart = await Carts.findOne(cartObjectId);
//   return cart;
// };
