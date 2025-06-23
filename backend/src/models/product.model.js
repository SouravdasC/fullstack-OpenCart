import mongoose, { Schema } from "mongoose"

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Product Name"],
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  description: {
    type: String,
    required: [true, "Please Enter Description"]
  },
  price: {
    type: Number,
    required: [true, "Please Enter Product Price"],
    maxLength: [8, "price cannot exceed 8 characters"]
  },
  ratings: {
    type: Number,
    default: 0
  },
  images: [
    {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  ],
  category: {
    type: String,
    required: [true, "Please Select category"]
  },
  stock: {
    type: Number,
    required: [true, "Please Select stock"],
    maxLength: [4, "stock cannot exceed 8 characters"],
    default: 1
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      name: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true
      },
      comment: {
        type: String,
        required: true
      }
    }
  ]
}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema)
