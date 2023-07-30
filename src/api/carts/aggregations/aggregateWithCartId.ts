import { ObjectId } from 'mongodb';
import cartAggregationPipeline from './cartAggregationPipeline';
import { Carts } from '../carts.model';
import { ResponseCart } from '../carts.types';

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