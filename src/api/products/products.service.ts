import { ClientSession, ObjectId, SortDirection } from 'mongodb';
import { Products } from './products.model';

interface QueryArguments {
  sort: string;
  order: SortDirection | undefined;
  skip: number;
  limit: number;
  category?: string;
}

const findProductById = async (id: string) => {
  const product = await Products.findOne(new ObjectId(id));
  return product;
};

const findDiscountedProducts = async ({ sort, order, skip, limit }: QueryArguments) => {
  // $where is not available in free atlas tier...
  let products;
  let totalResults;
  products = await Products.find({
    $expr: {
      $gt: [
        '$price',
        '$discountPrice',
      ],
    },
  }).sort(sort, order).skip(skip).limit(+limit).toArray();
  totalResults = await Products.countDocuments({
    $expr: {
      $gt: [
        '$price',
        '$discountPrice',
      ],
    },
  });

  return { products, totalResults };
};

const findProductsByCategory = async ({ category, sort, order, skip, limit }: QueryArguments) => {
  const products = await Products.find({ category }).sort(sort, order).skip(skip).limit(+limit).toArray();
  const totalResults = await Products.countDocuments({ category });

  return { products, totalResults };
};

const findAllProducts = async ({ sort, order, skip, limit }: QueryArguments) => {
  const products = await Products.find({}).sort(sort, order).skip(skip).limit(+limit).toArray();
  const totalResults = await Products.countDocuments();
  return { products, totalResults };
  
};

interface NewReviewArgs {
  isNew: true;
  oldRating?: never;
}

interface OldReviewArgs {
  isNew?: never;
  oldRating: number;
}

type UpdateRatingArgs = {
  productId: string;
  rating: number;
  session: ClientSession;
} & (NewReviewArgs | OldReviewArgs);

const updateRating = async ({ productId, rating, session, isNew, oldRating }: UpdateRatingArgs) => {
  const product = await findProductById(productId);
  if (!product) throw Error('Product not found');

  const newRatingsCount = isNew ? (product.ratingsCount) + 1 : product.ratingsCount;
  const newRating = isNew
    ? (product.rating * product.ratingsCount + rating) / newRatingsCount
    : ((product.rating * product.ratingsCount - oldRating) + rating) / product.ratingsCount;
    
  const formattedRating = parseFloat(newRating.toFixed(1));
  const result = await Products.updateOne({ _id: new ObjectId(productId) }, { $set: { rating: formattedRating, ratingsCount: newRatingsCount } }, { session });
  return result;
};

export { findProductById, findDiscountedProducts, findProductsByCategory, findAllProducts, updateRating };