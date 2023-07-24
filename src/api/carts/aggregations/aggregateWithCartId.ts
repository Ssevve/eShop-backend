import { ObjectId } from 'mongodb';
import defaultAggregationPipeline from './defaultAggregationPipeline';
import { Carts } from '../carts.model';

const aggregateWithCartId = async (cartId: string) => {
  const aggregationResult = await Carts.aggregate([
    {
      $match: {
        '_id': new ObjectId(cartId),
      },
    },
    ...defaultAggregationPipeline,
  ]).toArray();

  return aggregationResult[0];
};

export default aggregateWithCartId;