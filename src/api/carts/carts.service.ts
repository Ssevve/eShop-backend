import { ObjectId } from 'mongodb';
import { CartProduct, Carts } from './carts.model';
import cartAggregationPipeline from './cartAggregationPipeline';

const findSingleByUserId = async (userId: string) => {
  const cartAggregationResults = await Carts.aggregate([
    {
      $match: {
        'userId': new ObjectId(
          userId,
        ),
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

const updateSingle = async (cartId: string, products: CartProduct[]) => {
  const productsWithObjectIds = products.map((product) => ({ ...product, productId: new ObjectId(product.productId) }));
  await Carts.updateOne({ _id: new ObjectId(cartId) }, { $set: { 'products': productsWithObjectIds, 'updatedAt': new Date() } });
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
