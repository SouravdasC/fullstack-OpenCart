import React from 'react';
import { Rating } from 'react-simple-star-rating';
import profileImg from '../../images/Profile.png';

const ProductReviewCard = ({ review }) => {
  return (
    <div className="shadow-[2px_3px_11px_-3px_rgba(142,_108,_94,_0.54)] py-[20px] flex flex-col justify-center items-center">
      <img src={profileImg} alt="" className="w-[10vw]" />
      <p>{review.name}</p>
      <Rating
        initialValue={review.rating}
        size={20}
        SVGstyle={{ display: 'inline' }}
        fillColor="#ffd700"
      />
      <p>{review.comment}</p>
    </div>
  );
};

export default ProductReviewCard;
