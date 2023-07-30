import { ObjectId, WithId } from 'mongodb';
import cartAggregationPipeline from './cartAggregationPipeline';
import { Cart, Carts } from '../carts.model';

const aggregateWithCartId = async (cartId: string | ObjectId) => {
  const aggregationResult = await Carts.aggregate<WithId<Cart>>([
    {
      $match: {
        '_id': new ObjectId(cartId),
      },
    },
    ...cartAggregationPipeline,
  ]).toArray();

  return aggregationResult[0];
};

export default aggregateWithCartId;