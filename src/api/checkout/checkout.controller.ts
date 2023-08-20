import { Request, Response } from 'express';
import { findSingleById } from '@/api/carts/carts.service';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
  apiVersion: '2023-08-16',
});

export const createCheckoutSession = async (req: Request<{}, {}, { cartId: string }, {}>, res: Response) => {
  const clientUrl = 
  process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_PROD_URL
    : process.env.CLIENT_DEV_URL;

  const cartData = await findSingleById(req.body.cartId);
  const stripeItems = cartData.products.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product.name,
      },
      unit_amount: item.product.discountPrice * 100, // price in cents
    },
    quantity: item.amount,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: stripeItems,
      success_url: `${clientUrl}/success`,
      cancel_url: `${clientUrl}/cart`,
    });
    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};