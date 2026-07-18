const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const generateOrderNumber = () =>
  `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;

exports.createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress } = req.body;
  if (!shippingAddress) {
    return next(new AppError("shippingAddress is required", 400));
  }

  const cart = await Cart.findOne({ key: "default" });
  if (!cart || cart.items.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  const orderItems = [];
  let totalPrice = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new AppError(`Product ${item.product} no longer exists`, 404));
    }
    if (product.stock < item.quantity) {
      return next(
        new AppError(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
          400,
        ),
      );
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
    totalPrice += product.price * item.quantity;
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    product.stock -= item.quantity;
    product.inStock = product.stock > 0;
    await product.save();
  }

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    items: orderItems,
    totalPrice,
    shippingAddress,
    status: "pending",
  });

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort("-createdAt");
  res.status(200).json({
    status: "success",
    message: "Orders retrieved successfully",
    results: orders.length,
    data: orders,
  });
});

exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "items.product",
    "name description price",
  );
  if (!order) return next(new AppError("Order not found", 404));
  res.status(200).json({
    status: "success",
    message: "Order retrieved successfully",
    data: order,
  });
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!status || !allowed.includes(status)) {
    return next(new AppError(`Invalid status. Allowed: ${allowed.join(", ")}`, 400));
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true },
  );
  if (!order) return next(new AppError("Order not found", 404));

  res.status(200).json({
    status: "success",
    message: "Order status updated",
    data: order,
  });
});
