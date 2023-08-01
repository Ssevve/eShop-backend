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
      'cartDetails.totalProductAmount': {
        $reduce: {
          input: '$products',
          initialValue: 0,
          in: {
            $add: [
              '$$value',
              { $ifNull: ['$$this.amount', 0] },
            ],
          },
        },
      },
      'cartDetails.originalPrice': {
        $reduce: {
          input: '$products',
          initialValue: 0,
          in: {
            $round: [
              {
                $add: [
                  '$$value',
                  {
                    $ifNull: [
                      {
                        $multiply: [
                          {
                            $ifNull: [
                              '$$this.product.price',
                              0,
                            ],
                          },
                          '$$this.amount',
                        ],
                      },
                      0,
                    ],
                  },
                ],
              },
              2,
            ],
          },
        },
      },
      'cartDetails.totalDiscount': {
        $reduce: {
          input: '$products',
          initialValue: 0,
          in: {
            $add: [
              '$$value',
              {
                $round: [
                  {
                    $subtract: [
                      {
                        $add: [
                          0,
                          {
                            $ifNull: [
                              {
                                $multiply: [
                                  {
                                    $ifNull: [
                                      '$$this.product.price',
                                      0,
                                    ],
                                  },
                                  '$$this.amount',
                                ],
                              },
                              0,
                            ],
                          },
                        ],
                      },
                      {
                        $add: [
                          0,
                          {
                            $ifNull: [
                              {
                                $multiply: [
                                  {
                                    $ifNull: [
                                      '$$this.product.discountPrice',
                                      0,
                                    ],
                                  },
                                  '$$this.amount',
                                ],
                              },
                              0,
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  2,
                ],
              },
            ],
          },
        },
      },
      'cartDetails.finalPrice': {
        $reduce: {
          input: '$products',
          initialValue: 0,
          in: {
            $round: [
              {
                $add: [
                  '$$value',
                  {
                    $ifNull: [
                      {
                        $multiply: [
                          {
                            $ifNull: [
                              '$$this.product.discountPrice',
                              0,
                            ],
                          },
                          '$$this.amount',
                        ],
                      },
                      0,
                    ],
                  },
                ],
              },
              2,
            ],
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
