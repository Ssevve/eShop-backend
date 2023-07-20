import { ClientSession, ObjectId, SortDirection } from 'mongodb';
import { Reviews } from '../reviews/reviews.model';
import { Products } from './products.model';

interface QueryArguments {
  sort: string;
  order: number;
  skip: number;
  limit: number;
  category?: string;
}

const findProductById = async (id: string, session?: ClientSession) => {
  if (!ObjectId.isValid(id)) return null;
  const product = await Products.findOne(new ObjectId(id), { session });
  return product;
};

const findDiscountedProducts = async ({ sort, order, skip, limit }: QueryArguments) => {
  // $where is not available in free atlas tier...
  const products = await Products.find({
    $expr: {
      $gt: [
        '$price',
        '$discountPrice',
      ],
    },
  }).sort(sort, order as SortDirection).skip(skip).limit(+limit).toArray();
  
  const totalResults = await Products.countDocuments({
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
  const products = await Products.find({ category }).sort(sort, order as SortDirection).skip(skip).limit(+limit).toArray();
  const totalResults = await Products.countDocuments({ category });

  return { products, totalResults };
};

const findAllProducts = async ({ sort, order, skip, limit }: QueryArguments) => {
  const products = await Products.find({}).sort(sort, order as SortDirection).skip(skip).limit(+limit).toArray();
  const totalResults = await Products.countDocuments();
  return { products, totalResults };
  
};

interface UpdateRatingArgs {
  productId: string;
  session: ClientSession;
}

const updateRating = async ({ productId, session }: UpdateRatingArgs) => {
  const product = await findProductById(productId, session);
  if (!product) throw Error('Product with the given ID not found.');

  const reviews = await Reviews.find({ productId: new ObjectId(productId) }, { session }).toArray();
  const ratingsCount = reviews.length;
  const rating = parseFloat((reviews.reduce((acc, curr) => acc + curr.rating, 0) / ratingsCount).toFixed(1)) || 0;
  
  await Products.updateOne({ _id: new ObjectId(productId) }, { $set: { rating, ratingsCount } }, { session });
  const updatedProduct = await findProductById(productId, session);
  return updatedProduct;
};

export { findAllProducts, findDiscountedProducts, findProductById, findProductsByCategory, updateRating };
