const AppError = require("../utils/AppError.js");

const errorHandler = (err, _req, res, _next) => {
  let error = err;

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new AppError(`Validation Error: ${messages.join(", ")}`, 400);
  }

  if (err.name === "CastError") {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    error = new AppError(`Duplicate value for field: ${field}`, 409);
  }

  if (!(error instanceof AppError)) {
    console.error("Unexpected error:", err);
    error = new AppError(err.message || "Internal Server Error", 500);
  }

  res.status(error.statusCode).json({
    status: error.status || "error",
    message: error.message,
  });
};

module.exports = errorHandler;