const cartAggregationPipeline = 
[
  {
    $unwind: {
      path: '$products',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: 'products',
      localField: 'products.productId',
      foreignField: '_id',
      as: 'products.product',
    },
  },
  {
    $project: {
      _id: 1,
      userId: 1,
      'products.amount': 1,
      'products.product._id': 1,
      'products.product.price': 1,
      'products.product.discountPrice': 1,
      'products.product.imageUrl': 1,
      'products.product.quantity': 1,
      'products.product.name': 1,
    },
  },
  {
    $unwind: {
      path: '$products.product',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $group: {
      _id: '$_id',
      products: {
        $push: '$products',
      },
    },
  },
  {
    $lookup: {
      from: 'carts',
      localField: '_id',
      foreignField: '_id',
      as: 'cartDetails',
    },
  },
  {
    $unwind: {
      path: '$cartDetails',
    },
  },
  {
    $addFields: {
      'cartDetails.products': {
        $filter: {
          input: '$products',
          as: 'product',
          cond: {
            $ifNull: ['$$product.amount', false],
          },
        },
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: '$cartDetails',
    },
  },
];

export default cartAggregationPipeline;
