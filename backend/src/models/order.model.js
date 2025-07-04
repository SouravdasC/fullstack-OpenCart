import mongoose, { Schema } from "mongoose";


const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    },
    shippingInfo: {
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      pinCode: {
        type: Number,
        required: true
      },
      phoneNo: {
        type: Number,
        required: true
      },
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        image: {
          type: String,
          required: true
        }
      }
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    paymentInfo: {
      id: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true
      }
    },
    paidAt: {
      type: Date,
      required: true
    },
    itemsPrice: {
      type: Number,
      default: 0,
      required: true
    },
    taxPrice: {
      type: Number,
      default: 0,
      required: true
    },
    shippingPrice: {
      type: Number,
      default: 0,
      required: true
    },
    totalPrice: {
      type: Number,
      default: 0,
      required: true
    },
    orderStatus: {
      type: String,
      required: true,
      default: "processing"
    },
    deliverdAt: Date
  },{timestamps: true}
)

export const Order = mongoose.model("Order", orderSchema)