import { ObjectId } from 'mongodb';
import defaultCartAggregationPipeline from './defaultAggregationPipeline';
import { Carts } from '../carts.model';

const aggregateWithCartId = async (cartId: string) => {
  const aggregationResult =  await Carts.aggregate([
  
    {
      $match: {
        'cartId': new ObjectId(cartId),
      },
    },
    ...defaultCartAggregationPipeline,
  ]).toArray();

  return aggregationResult[0];
};

export default aggregateWithCartId;