const Cart = require("../models/cart");
const Product = require("../models/product");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const getOrCreateCart = async () => {
  let cart = await Cart.findOne({ key: "default" });
  if (!cart) {
    cart = await Cart.create({ key: "default", items: [], totalPrice: 0 });
  }
  return cart;
};

exports.getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart();
  await cart.populate("items.product", "name description price images inStock");
  res.status(200).json({
    status: "success",
    message: "Cart retrieved successfully",
    data: cart,
  });
});

exports.addItem = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return next(new AppError("productId is required", 400));
  if (quantity < 1) return next(new AppError("Quantity must be at least 1", 400));

  const product = await Product.findById(productId);
  if (!product) return next(new AppError("Product not found", 404));

  const cart = await getOrCreateCart();
  const existing = cart.items.find(
    (item) => item.product.toString() === productId.toString(),
  );

  const newQty = (existing?.quantity || 0) + Number(quantity);
  if (product.stock < newQty) {
    return next(
      new AppError(
        `Insufficient stock. Available: ${product.stock}, requested: ${newQty}`,
        400
      )
    );
  }

  if (existing) {
    existing.quantity = newQty;
    existing.price = product.price;
  } else {
    cart.items.push({
      product: product._id,
      quantity: Number(quantity),
      price: product.price,
    });
  }

  cart.recalculateTotal();
  await cart.save();
  await cart.populate("items.product", "name description price images inStock");

  res.status(200).json({
    status: "success",
    message: "Item added to cart",
    data: cart,
  });
});

exports.updateItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  if (quantity === undefined || quantity < 0) {
    return next(new AppError("Valid quantity is required (>= 0)", 400));
  }

  const cart = await getOrCreateCart();
  const item = cart.items.find((cartItem) => cartItem.product.toString() === productId);
  if (!item) return next(new AppError("Item not found in cart", 404));

  if (Number(quantity) === 0) {
    cart.items = cart.items.filter((cartItem) => cartItem.product.toString() !== productId);
  } else {
    const product = await Product.findById(productId);
    if (!product) return next(new AppError("Product not found", 404));
    if (product.stock < quantity) {
      return next(new AppError(`Insufficient stock. Available: ${product.stock}`, 400));
    }
    item.quantity = Number(quantity);
    item.price = product.price;
  }

  cart.recalculateTotal();
  await cart.save();
  await cart.populate("items.product", "name description price images inStock");

  res.status(200).json({
    status: "success",
    message: "Cart item updated",
    data: cart,
  });
});

exports.removeItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const cart = await getOrCreateCart();
  const before = cart.items.length;
  cart.items = cart.items.filter((cartItem) => cartItem.product.toString() !== productId);
  if (cart.items.length === before) {
    return next(new AppError("Item not found in cart", 404));
  }

  cart.recalculateTotal();
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Item removed from cart",
    data: cart,
  });
});

exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart();
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart cleared",
    data: cart,
  });
});
