const Product = require("../models/product");
const Category = require("../models/category");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.getAllProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, inStock, search } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (inStock !== undefined) filter.inStock = inStock === "true";

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const products = await Product.find(filter)
    .populate("category", "name description")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    message: "Products retrieved successfully",
    results: products.length,
    data: products,
  });
});

exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name description",
  );
  if (!product) return next(new AppError("Product not found", 404));
  res.status(200).json({
    status: "success",
    message: "Product retrieved successfully",
    data: product,
  });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const { category } = req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(new AppError(`Category with id ${category} does not exist`, 404));
  }

  const product = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: product,
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  if (req.body.category) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return next(new AppError("Category does not exist", 404));
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return next(new AppError("Product not found", 404));

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return next(new AppError("Product not found", 404));
  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: null,
  });
});