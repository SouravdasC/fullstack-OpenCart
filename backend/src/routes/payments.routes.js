import { Router } from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";
import { processPayment, sendStripeApiKey } from "../controllers/payments.controller.js";



const paymentRouter = Router();

//process payment
paymentRouter.route('/payment/process').post(isAuthenticatedUser, processPayment)


// Send Stripe public API key
paymentRouter.route('/stripeapikey').get(isAuthenticatedUser, sendStripeApiKey)

export default paymentRouter