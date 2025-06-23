import React from 'react';
import { Link } from 'react-router-dom';

const CartItemsCard = ({ item, onRemove, onQtyChange }) => {
  const price = Number(item?.price) || 0;
  const quantity = Number(item?.quantity) || 0;
  const subtotal = price * quantity;

  return (
    <div className="flex items-center justify-between border p-4 rounded-xl shadow-sm mb-4">
      <div className="flex items-center gap-4">
        <img
          src={item?.image || '/default.jpg'}
          alt={item?.name || 'Product'}
          className="w-20 h-20 object-cover rounded border"
          onError={e => {
            e.target.src = '/fallback.png';
          }} // optional fallback
        />

        <div>
          <Link to={`/product/${item?.product}`} className="font-semibold text-lg hover:underline">
            {item?.name || 'No Name'}
          </Link>
          <p>Price: ₹{price}</p>

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => onQtyChange(item.product, item.quantity - 1)}
              disabled={item?.quantity <= 1}
              className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => onQtyChange(item.product, item.quantity + 1)}
              disabled={item?.quantity >= item?.stock}
              className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
            >
              +
            </button>
          </div>

          <p className="font-medium mt-2">Subtotal: ₹{subtotal}</p>
        </div>
      </div>
      <button
        onClick={() => onRemove(item?.product)}
        className="text-red-500 hover:underline text-sm cursor-pointer"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItemsCard;
