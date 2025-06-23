import mongoose from "mongoose"
import { Product } from "../models/product.model.js"
import { errorAsynHandler } from "../utils/errorAsynHandler.js"
import { ErrorHandler } from "../utils/errorHandler.js"
import { ApiFeatures } from "../utils/apiFeatures.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { v2 as cloudinary } from 'cloudinary';

// create product for admin : /api/v1/admin/product/new
const createProduct = errorAsynHandler(
  async (req, res, next) => {

    // const images = req.files; // multer gives you req.files

    // images upload
    const imagesLinks = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadOnCloudinary(file.path);
        if (!result) {
          return next(new ErrorHandler(500, "Failed to upload images"));
        }

        imagesLinks.push({
          public_id: result.public_id,
          url: result.url,
        });
      }
    } else {
      return next(new ErrorHandler(400, "Minimum one image is required"));
    }


    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body)

    if (!product) {
      return next(new ErrorHandler(500, "product not found"));
    }

    res.status(201).json({ success: true, product })
  }
)

// update product for admin: /api/v1/admin/product/:id
const updateProduct = errorAsynHandler(async (req, res, next) => {
  const productId = req.params.id;

  let product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler(404, "Product not found"));
  }

  // === Delete old images from Cloudinary ===
  if (product.images && product.images.length > 0) {
    for (let img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  }

  // === Upload new images to Cloudinary ===
  const imagesLinks = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (!result) {
        return next(new ErrorHandler(500,"Failed to upload images"));
      }

      imagesLinks.push({
        public_id: result.public_id,
        url: result.url,
      });
    }
  } else {
    return next(new ErrorHandler(400,"Minimum one image is required" ));
  }

  // === Attach new image links to the body ===
  req.body.images = imagesLinks;

  // === Ensure user field is not updated ===
  if ("user" in req.body) {
    delete req.body.user;
  }

  // === Perform the update ===
  const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false, // recommended for Mongoose deprecation warnings
  });

  res.status(200).json({
    success: true,
    product: updatedProduct,
  });
});


// delete product : /api/v1/admin/product/:id
const deleteProduct = errorAsynHandler(
  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ErrorHandler(400, "Invalid product ID")
    }

    let product = await Product.findById(id)

    if (!product) {
      throw new ErrorHandler(500, "product not found")
    }


    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.uploader.destroy(product.images[i].public_id)
    }


    product = await Product.findByIdAndDelete(req.params?.id)

    res.status(200)
      .json({ success: true, message: "product delete successfully" })
  }
)

// get product details : /api/v1/product/:id
const getProductDetails = errorAsynHandler(
  async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler(400, "Invalid product ID"));
    }

    const product = await Product.findById(id);

    if (!product) return next(new ErrorHandler(404, "Product not found"));

    res.status(200).json({ success: true, product })
  }
)

// get admin all product: /api/v1//admin/products
const getAllAdminProduct = errorAsynHandler(
  async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments();

    const products = await Product.find()
      .sort({ createdAt: -1 }) // ✅ newest first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      products,
      productsCount: total,
      resultPerPage: limit,
    });
    res.status(200).json({ success: true, products })
  }
)

// get all product: /api/v1/products
const getAllProduct = errorAsynHandler(
  async (req, res) => {
    // pagination
    const resultPerPage = 10;

    // count product in dashboard
    const productsCount = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter()

    apiFeatures.pagination(resultPerPage)
    const products = await apiFeatures.query
    let filteredProductsCount = products.length;

    if (!products) {

      throw new ErrorHandler(500, "products not found")
    }

    // price range max and min
    const prices = await Product.find().select('price');
    const priceArray = prices.map(p => p.price);
    const minPrice = Math.min(...priceArray);
    const maxPrice = Math.max(...priceArray);


    res.status(200).json({ success: true, products, productsCount, resultPerPage, filteredProductsCount, maxPrice, minPrice })
  }
)

// create review and update review: /api/v1/product/review
const createProductReview = errorAsynHandler(async (req, res, next) => {

  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(res => res.user.toString() === req.user._id);

  if (isReviewed) {

    product.reviews.forEach(res => {
      if (product.reviews.find(res => res.user.toString() === req.user._id.toString()))
        res.rating = rating,
          res.comment = comment
    })
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length
  }

  //average total rating
  let avg = 0;

  product.reviews.forEach(res => {
    avg += res.rating
  })

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false })

  res.status(200).json({ success: true })
})

// get all reviews of a single product: /api/v1/review
const getProductReview = errorAsynHandler(async (req, res, next) => {

  const { id } = req.params;

   const product = await Product.findById(id).select('name reviews');

  if (!product) {
    return next(new ErrorHandler(404, "Product not found"));
  }


  res.status(200)
    .json({
      success: true,
      productName: product.name,
      reviews: product.reviews
    })
})


// delete reviews: /api/v1/reviews
const deleteReview = errorAsynHandler(async (req, res, next) => {
  const { productId, id: reviewId } = req.query;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler(404, "Product not found"));
  }

  const reviews = product.reviews.filter(
    review => review._id.toString() !== reviewId.toString()
  );

  let avg = 0;
  reviews.forEach(review => {
    avg += review.rating;
  });

  const ratings = reviews.length === 0 ? 0 : avg / reviews.length;
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(productId, {
    reviews,
    ratings,
    numOfReviews,
  }, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true });
});



export { getAllProduct, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReview, deleteReview, getAllAdminProduct }