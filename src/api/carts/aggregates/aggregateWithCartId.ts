import { ObjectId } from 'mongodb';
import { Carts } from '../carts.model';
import { ResponseCart } from '../carts.types';
import cartAggregatePipeline from './cartAggregatePipeline';

const aggregateWithCartId = async (cartId: string) => {
  const aggregateResult = await Carts.aggregate<ResponseCart>([
    {
      $match: {
        '_id': new ObjectId(cartId),
      },
    },
    ...cartAggregatePipeline,
  ]).toArray();

  return aggregateResult[0];
};

export default aggregateWithCartId;