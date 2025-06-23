import { SkeletonShipping } from '@/components/shimmerEffect/SkeletonShipping';
import Checkout from '@/components/stepper/Checkout';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const ConfirmOrder = () => {
  const { cartItems, shippingInfo, loading } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const shippingCharges = subtotal > 1000 ? 0 : 50;
  const tax = +(subtotal * 0.18).toFixed(2);
  const totalPrice = Number(subtotal + tax + shippingCharges);

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country} - ${shippingInfo.pinCode}`;

  const proceedToPayment = () => {
    const orderInfo = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem('orderInfo', JSON.stringify(orderInfo));
    navigate('/process/payment');
  };

  useEffect(() => {
    // simulate loading delay
    const timer = setTimeout(() => {
      setLoader(false);
    }, 1000); // 1s delay for visual effect

    return () => clearTimeout(timer);
  }, []);

  if (loader) return <SkeletonShipping />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-black">
      <h2 className="text-2xl font-semibold mb-6 text-center">Confirm Order</h2>
      <Checkout activeStep={1} />

      {/* Shipping Info */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-2">Shipping Info</h3>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Phone:</strong> {shippingInfo.phoneNo}
        </p>
        <p>
          <strong>Address:</strong> {address}
        </p>
      </div>

      {/* Cart Items */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Your Cart Items:</h3>
        {cartItems.map(item => (
          <div key={item.product} className="flex items-center justify-between mb-4 border-b pb-3">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
              <Link
                to={`/product/${item.product}`}
                className="text-lg text-blue-600 hover:underline"
              >
                {item.name}
              </Link>
            </div>
            <div>
              {item.quantity} x ₹{item.price} = <strong>₹{item.quantity * item.price}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Charges:</span>
            <span>₹{shippingCharges}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (18%):</span>
            <span>₹{tax}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="text-right">
        <button
          onClick={proceedToPayment}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default ConfirmOrder;
