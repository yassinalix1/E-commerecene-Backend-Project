const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
    name: { type: String, required: [true, "Product name is required"] },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: [true, "Full name is required"] },
    street: { type: String, required: [true, "Street is required"] },
    city: { type: String, required: [true, "City is required"] },
    country: { type: String, required: [true, "Country is required"] },
    zipCode: { type: String, required: [true, "Zip code is required"] },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: [true, "Order number is required"],
    },
    items: {
      type: [orderItemSchema],
      validate: [(v) => v.length > 0, "Order must have at least one item"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        message: "Status must be pending|confirmed|shipped|delivered|cancelled",
      },
      default: "pending",
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, "Shipping address is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);