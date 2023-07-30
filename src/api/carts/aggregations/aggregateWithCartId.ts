import { ObjectId } from 'mongodb';
import { Carts } from '../carts.model';
import { ResponseCart } from '../carts.types';
import cartAggregationPipeline from './cartAggregationPipeline';

const aggregateWithCartId = async (cartId: string) => {
  const aggregationResult = await Carts.aggregate<ResponseCart>([
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