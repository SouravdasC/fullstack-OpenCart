import CartItemsCard from '@/components/cartCom/CartItemsCard';
import MetaData from '@/components/layout/MetaData';
import { SkeletonCard } from '@/components/shimmerEffect/SkeletonCard';
import {
  calculateTotalPrice,
  removeItemsFromCart,
  updateCartQuantity,
} from '@/redux/reducer/cartReducer/cartItemsSlice';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, subtotal, tax, shipping, totalPrice, loading, error } = useSelector(
    state => state.cart
  );

  // remove from cart
  const handleRemove = productId => {
    dispatch(removeItemsFromCart(productId));
  };

  // update qunatity
  const handleQtyChange = (productId, newQty) => {
    const item = cartItems.find(i => i.product === productId);
    if (!item) return;

    // Prevent quantity from going below 1
    if (newQty < 1) return;

    // Prevent going above stock
    if (newQty > item.stock) {
      toast.error(`Only ${item.stock} item(s) in stock`);
      return;
    }

    dispatch(updateCartQuantity({ productId, quantity: newQty }));
    dispatch(calculateTotalPrice());
  };

  // proceed check out
  const handleCheckOut = () => {
    // navigate('/login?redirect=shipping'); or
    navigate(`/login?redirect=${encodeURIComponent('/shipping')}`);
  };

  useEffect(() => {
    dispatch(calculateTotalPrice());
  }, [cartItems, dispatch]);

  // for error
  useEffect(() => {
    if (error) {
      toast.error('product not added in cart');
    }
  }, [error]);

  return (
    <>
      {loading ? (
        <SkeletonCard />
      ) : (
        <div>
          <MetaData title={'Cart'} />
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

            {cartItems.length === 0 ? (
              <div className="flex flex-col justify-center items-center">
                <p className="text-center text-gray-500">Your cart is empty.</p>
                <Link
                  to={'/products'}
                  className="border-2 capitalize font-bold bg-amber-800 text-white px-3 py-2.5"
                >
                  view products
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  {cartItems.map((item, i) => (
                    <CartItemsCard
                      key={i}
                      item={item}
                      onRemove={handleRemove}
                      onQtyChange={handleQtyChange}
                    />
                  ))}
                </div>

                <div className="bg-gray-100 p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4">Cart Summary</h3>
                  <p>Subtotal: ₹{subtotal}</p>
                  <p>Tax(18%): ₹{tax}</p>
                  <p>Shipping: ₹{shipping}</p>
                  <hr className="my-2" />
                  <p className="font-bold text-lg">Total: ₹{totalPrice}</p>

                  <button
                    className="cursor-pointer mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleCheckOut}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
