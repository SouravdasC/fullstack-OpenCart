import React from 'react';
import { Link } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';

const ProductsCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`}>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
        {/* Image */}
        <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden flex justify-center items-center">
          <img
            src={product?.images[0]?.url}
            alt={product.name}
            className="py-4 w-[160px] h-[180px] object-cover group-hover:scale-105 transition-transform duration-300 "
          />
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          {/* Product Name */}
          <h3 className="text-md font-semibold text-gray-800 dark:text-white truncate">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Rating
              initialValue={product.ratings}
              readonly
              size={18}
              SVGstyle={{ display: 'inline' }}
              fillColor="#facc15"
              emptyColor="#e5e7eb"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({product.numOfReviews})
            </span>
          </div>

          {/* Price */}
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">₹{product.price}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductsCard;
