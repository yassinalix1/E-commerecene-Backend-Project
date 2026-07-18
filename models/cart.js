const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
    quantity: {
      type: Number,
      min: [1, "Quantity must be at least 1"],
      required: [true, "Quantity is required"],
    },
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
      required: [true, "Price is required"],
    },
  },
  { _id: false }
);
const cartSchema = new mongoose.Schema(
  {
    key: { type: String, default: "default" },
    items: [cartItemSchema], 
    totalPrice: { type: Number, default: 0 }
  },
  { timestamps: true }
);

cartSchema.methods.recalculateTotal = function () {
  let tempSum = 0;
  for (let i = 0; i < this.items.length; i++) {
    const item = this.items[i];
    tempSum += item.price * item.quantity;
  }
  this.totalPrice = tempSum;
  return this.totalPrice;
};

module.exports = mongoose.model("Cart", cartSchema);