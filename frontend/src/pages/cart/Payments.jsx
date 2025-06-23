import React, { useEffect, useRef, useState } from 'react';
import MetaData from '@/components/layout/MetaData';
import Checkout from '@/components/stepper/Checkout';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { clearError } from '@/redux/reducer/order/orderslice';
import { createOrder } from '@/redux/thunk/orderThunk/orderThunk';
import { SkeletonPayment } from '@/components/shimmerEffect/SkeletonPayment';

const Payments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);
  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));

  const { shippingInfo, cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.user);
  const { error, loading } = useSelector(state => state.order);
  const [loader, setLoader] = useState(true);

  // odrer details
  const orderDetails = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo?.subtotal,
    taxPrice: orderInfo?.tax,
    shippingPrice: orderInfo?.shippingCharges,
    totalPrice: orderInfo?.totalPrice,
  };

  const paymentData = {
    amount: Math.round(orderInfo?.totalPrice * 100),
  };

  // payment form submit
  const handlePaymentSubmit = async e => {
    e.preventDefault();
    payBtn.current.disabled = true;

    try {
      const { data } = await axios.post('/api/v1/payment/process', paymentData);

      // console.log(data);

      const client_secret = data.client_secret;

      if (!(stripe || elements)) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          orderDetails.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          // order api
          dispatch(createOrder(orderDetails));
          navigate('/success');
        } else {
          toast.error('there"s some issue white Processing a payment');
        }
      }
    } catch (error) {
      payBtn.current.disabled = true;
      toast.error(error);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error('new order not created');
      dispatch(clearError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loader) return <SkeletonPayment />;

  return (
    <div>
      <div className="max-w-2xl mx-auto p-6">
        <MetaData title="Payment" />
        <Checkout activeStep={3} />

        <h2 className="text-2xl font-bold text-center mt-6 mb-8">Payment Details</h2>
        {loading ? (
          <SkeletonPayment />
        ) : (
          <form
            onSubmit={handlePaymentSubmit}
            className="bg-white shadow-md rounded-lg p-6 space-y-5"
          >
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <CreditCardIcon />
                Card Number
              </label>
              <CardNumberElement className="border rounded-md p-2" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <EventIcon />
                Expiry Date
              </label>
              <CardExpiryElement className="border rounded-md p-2" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <VpnKeyIcon />
                CVC
              </label>
              <CardCvcElement className="border rounded-md p-2" />
            </div>

            <button
              type="submit"
              ref={payBtn}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              {orderInfo ? `Pay ₹${orderInfo.totalPrice}` : 'Processing...'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Payments;
