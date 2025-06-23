import { Stripe } from 'stripe'
import dotenv from 'dotenv'
import { errorAsynHandler } from '../utils/errorAsynHandler.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const processPayment = errorAsynHandler(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create(
    {
      amount: req.body.amount,
      currency: 'inr',
      metadata: {
        company: 'Ecommerce',
      },
    }
  )

  res.status(201).json({ success: true, client_secret: myPayment.client_secret, })
})

export const sendStripeApiKey = errorAsynHandler(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
});