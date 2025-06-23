import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper/modules';
import { getProductDetails } from '../redux/thunk/productThunk';
import toast from 'react-hot-toast';
import ProductReviewCard from '../components/product/ProductReviewCard';
import MetaData from '@/components/layout/MetaData';
import { addItemsToCart } from '@/redux/thunk/cartThunk/cartThunk';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Rating } from 'react-simple-star-rating';
import { newReviewSubmit } from '@/redux/thunk/reviewThunk/reviewThunk';
import { clearReviewState } from '@/redux/reducer/reviewReducer/reviewSlice';
import { SkeletonCard } from '@/components/shimmerEffect/SkeletonCard';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { SkeletonProductDetails } from '@/components/shimmerEffect/SkeletonProductDetails';

function ProductDetails() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [localProduct, setLocalProduct] = useState(null);
  const [open, setOpen] = useState();
  const [rating, setRating] = useState();
  const [comment, setComment] = useState();

  const dispatch = useDispatch();
  const { productDetails, loading, error } = useSelector(state => state.product);
  const {
    success,
    loading: reviewLoading,
    error: reviewError,
  } = useSelector(state => state.review);

  // for submit review toggle
  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  //review submit
  const reviewSubmitHandler = () => {
    const formData = { rating, comment, productId: id };
    dispatch(newReviewSubmit(formData));
    setOpen(false);
  };

  // details all product by id
  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id]);

  // clone of product details
  useEffect(() => {
    if (productDetails) {
      setLocalProduct({ ...productDetails });
    }
  }, [productDetails]);

  // error handler
  useEffect(() => {
    if (error) {
      toast.error('Product details not found');
    }

    if (success) {
      toast.success('review submitted successfully');
      dispatch(getProductDetails(id));
      dispatch(clearReviewState());
    }
    if (reviewError) {
      toast.error('Product review failed');
      dispatch(clearReviewState());
    }
  }, [error, success, reviewError, dispatch, id]);

  // product increase button
  const increaseQty = () => {
    if (localProduct?.stock <= quantity) {
      toast.error('Cannot exceed available stock');
      return;
    }
    setQuantity(prev => prev + 1);
  };

  // product decrease button
  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // add to cart handler
  const addToCartHandler = () => {
    if (localProduct?.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    dispatch(addItemsToCart({ id, quantity }))
      .unwrap()
      .then(() => {
        setLocalProduct(prev => ({
          ...prev,
          stock: prev.stock - quantity,
        }));
        setQuantity(1);
        toast.success('Added to cart!');
      })
      .catch(err => {
        const message = typeof err === 'string' ? err : err?.message || 'Failed to add to cart';
        toast.error(message);
      });
  };

  return (
    <>
      {loading || !localProduct ? (
        <SkeletonProductDetails />
      ) : (
        <div>
          <MetaData title={`${localProduct.name}`} />
          <div className="px-[15px] py-[20px] md:px-auto md:py-[30px] w-full flex flex-col md:flex-row justify-center">
            <div className="md:border-2 w-[30vw] border-white md:px-[24px] md:py-[24px] lg:px-[80px] lg:py-[35px]">
              <Swiper
                cssMode={true}
                navigation={true}
                pagination={true}
                mousewheel={true}
                keyboard={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
                className="mySwiper"
              >
                {localProduct.images?.map((item, i) => (
                  <SwiperSlide key={i}>
                    <LazyLoadImage
                      src={item.url}
                      alt={item.name}
                      className="w-[600px] h-[600px] object-contain rounded-lg animate-fadeIn md:w-[350px]"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="md:border-2 border-white pt-[20px] md:pr-[30px] md:pl-[20px] md:pt-[20px] lg:pr-[10vw] md:py-[28px] lg:py-[15px] flex flex-col gap-[12px] md:gap-[30px]">
              <div>
                <h2 className="text-[20px] md:text-[30px] lg:text-[3rem] capitalize italic">
                  {localProduct.name}
                </h2>
                <p className="text-[12px] md:text-[15px] capitalize font-medium">
                  Product id: <span>{localProduct._id}</span>
                </p>
              </div>

              <div className="text-center flex justify-center items-center gap-4 border-gray-300 border-b border-t px-0 py-3">
                <Rating
                  initialValue={localProduct.ratings}
                  size={20}
                  SVGstyle={{ display: 'inline' }}
                  fillColor="#ffd700"
                />
                <span className="capitalize text-center">
                  ({localProduct.numOfReviews} reviews)
                </span>
              </div>

              <div>
                <h3 className="mb-[30px] md:text-[20px] lg:text-3xl">{`Price: ₹${localProduct.price}`}</h3>
                <div className="flex justify-around items-center-safe">
                  <div>
                    <button
                      className="cursor-pointer px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={decreaseQty}
                    >
                      -
                    </button>
                    <input
                      value={quantity}
                      type="number"
                      className="bg-white text-black w-[40px] md:w-[45px] lg:w-[3vw] text-center"
                      readOnly
                    />
                    <button
                      className="cursor-pointer px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={increaseQty}
                    >
                      +
                    </button>
                  </div>
                  <button
                    disabled={localProduct.stock < 1}
                    className={`cursor-pointer rounded-full px-5 py-1 capitalize duration-200 ease-in-out ${
                      localProduct.stock < 1
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-red-400 text-white hover:bg-red-300 hover:text-black'
                    }`}
                    onClick={addToCartHandler}
                  >
                    add to cart
                  </button>
                </div>
              </div>

              <p className="border-gray-300 border-b border-t px-0 py-3">
                Status:{' '}
                <b className={localProduct.stock < 1 ? 'text-red-600' : 'text-green-600'}>
                  {localProduct.stock < 1 ? 'Out Of Stock' : 'In Stock'}
                </b>
                <span> ({localProduct.stock})</span>
              </p>

              <div>
                <h4>Description :</h4>
                <span>{localProduct.description}</span>
              </div>

              <button
                type="submit"
                onClick={submitReviewToggle}
                className="cursor-pointer rounded-full bg-red-400 text-white capitalize px-5 py-1 hover:bg-red-300 hover:text-black duration-300 ease-in-out"
              >
                submit review
              </button>
            </div>
          </div>

          <div className="mx-auto my-6 px-[20px]">
            <h2 className="flex justify-center items-center border-b uppercase font-bold">
              Product &nbsp; Reviews
            </h2>
            <div>
              {reviewLoading ? (
                <SkeletonCard />
              ) : (
                <Dialog
                  aria-labelledby="simple-dialog-title"
                  open={open}
                  onClose={submitReviewToggle}
                >
                  <DialogTitle>Submit Review</DialogTitle>
                  <DialogContent>
                    <Rating
                      onClick={rate => setRating(rate)} // Required: capture rating value
                      initialValue={Number(rating)} // Pre-fill if value exists
                      allowHalfIcon // ✅ Enable half-stars
                      size={30}
                      fillColor="#ffd700"
                      emptyColor="#e0e0e0"
                      SVGstyle={{ display: 'inline' }}
                      allowHover
                      transition
                    />

                    <textarea
                      cols="30"
                      rows="5"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button className="text-red-500" onClick={submitReviewToggle}>
                      cancel
                    </Button>
                    <Button className="text-primary" onClick={reviewSubmitHandler}>
                      submit
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
            </div>
            <div>
              {localProduct.reviews?.length > 0 ? (
                <div className="grid grid-col-1 md:grid-cols-3 gap-4">
                  {localProduct.reviews.map((review, index) => (
                    <ProductReviewCard key={index} review={review} />
                  ))}
                </div>
              ) : (
                <h3 className="uppercase flex justify-center items-center mt-4 font-bold">
                  no reviews yet
                </h3>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductDetails;
