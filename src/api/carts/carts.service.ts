import { ObjectId } from 'mongodb';
import cartAggregationPipeline from './cartAggregationPipeline';
import { Carts } from './carts.model';
import { UpdateSingleCartParams } from './carts.types';

const findSingleByUserId = async (userId: string) => {
  const cartAggregationResults = await Carts.aggregate([
    {
      $match: {
        'userId': new ObjectId(userId),
      },
    },
    ...cartAggregationPipeline,
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

const updateSingle = async ({ cartId, productId, quantity }: UpdateSingleCartParams) => {
  const cartObjectId = new ObjectId(cartId);
  const cart = await Carts.findOne(cartObjectId);

  const newProducts = cart?.products
    .filter((product) => product.productId.toString() !== productId)
    .concat({ productId: new ObjectId(productId), quantity });

  const updateResult = await Carts.updateOne({ _id: cartObjectId },
    { 
      $set: 
      { 
        'products': newProducts,
        'updatedAt': new Date(),
      },
    });
  if (!updateResult.modifiedCount) throw Error('Failed to update the cart.');
  const cartAggregationResults = await Carts.aggregate([
    {
      $match: {
        'cartId': new ObjectId(cartId),
      },
    },
    ...cartAggregationPipeline,
  ]).toArray();
  return cartAggregationResults[0];
};

export { createSingle, findSingleByUserId, updateSingle };

