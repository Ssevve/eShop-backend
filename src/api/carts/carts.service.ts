import { ObjectId } from 'mongodb';
import defaultAggregationPipeline from './aggregations/defaultAggregationPipeline';
import { Carts } from './carts.model';
import { RemoveAllProductsParams,
  RemoveSingleProductParams,
  UpdateSingleProductQuantityParams,
  AddSingleProductParams,
} from './carts.types';
import { productConstraints } from '@/lib/constants';
import aggregateWithCartId from './aggregations/aggregateWithCartId';

const findSingleByUserId = async (userId: string) => {
  const cartAggregationResults = await Carts.aggregate([
    {
      $match: {
        'userId': new ObjectId(userId),
      },
    },
    ...defaultAggregationPipeline,
  ]).toArray();

  return cartAggregationResults[0];
};

const createSingle = async (userId: string) => {
  const insertResult = await Carts.insertOne({
    userId: new ObjectId(userId),
    products: [],
    createdAt: new Date(),
  });

  const cart = await Carts.findOne(insertResult.insertedId);
  return cart;
};

const addSingleProduct = async ({ cartId, productId, quantity }: AddSingleProductParams) => {
  const cartObjectId = new ObjectId(cartId);
  const cart = await Carts.findOne(cartObjectId);

  let newProduct = {
    productId: new ObjectId(productId),
    quantity,
  };

  const duplicate = cart?.products.find((product) => product.productId.toString() === productId);
  if (duplicate) {
    let newQuantity = quantity += duplicate.quantity;
    if (newQuantity < productConstraints.quantity.min) newQuantity = productConstraints.quantity.min;
    else if (newQuantity > productConstraints.quantity.max) newQuantity = productConstraints.quantity.max;
    newProduct.quantity = newQuantity;
  }

  const newProducts = cart?.products
    .filter((product) => product.productId.toString() !== productId);

  newProducts?.push(newProduct);

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

const updateSingleProductQuantity = async ({ cartId, productId, quantity }: UpdateSingleProductQuantityParams) => {
  const cartObjectId = new ObjectId(cartId);
  const cart = await Carts.findOne(cartObjectId);
  
  const product = cart?.products.find((prod) => prod.productId.toString() === productId);
  if (product) product.quantity = quantity;

  const updateResult = await Carts.updateOne({ _id: cartObjectId },
    { 
      $set:
      { 
        'products': cart?.products,
        'updatedAt': new Date(),
      },
    });
  if (!updateResult.modifiedCount) throw Error('Failed to update the cart.');
  return aggregateWithCartId(cartId);
};

const removeSingleProduct = async ({ cartId, productId }: RemoveSingleProductParams) => {
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

const removeAllProducts = async ({ cartId }: RemoveAllProductsParams) => {
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

export { createSingle, findSingleByUserId, addSingleProduct, updateSingleProductQuantity, removeSingleProduct, removeAllProducts };

