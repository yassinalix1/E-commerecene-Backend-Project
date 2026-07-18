🛒 E-Commerce API

A REST API for a simple e-commerce backend, built with Node.js, Express, and MongoDB (Mongoose). It provides Categories, Products (with filtering and search), a Cart, and Orders with a full checkout flow.

✨ Features


🗂️ Categories — CRUD with auto-generated slugs
📦 Products — CRUD, filterable by category, price range, stock status, and free-text search
🛍️ Cart — single-cart add/update/remove/clear, with live stock validation and totals
🧾 Orders — checkout from the cart, stock is decremented, order history and status updates (pending → confirmed → shipped → delivered → cancelled)
🔒 Security/validation — request body validation (express-validator) and NoSQL-injection sanitization (express-mongo-sanitize)
🌱 Seed script — populates the database with sample categories and products


🧰 Tech Stack


Node.js / Express
MongoDB with Mongoose
express-validator, express-mongo-sanitize
nodemon (dev)


📁 Project Structure

.
├── app.js                 # App entry point, middleware & route mounting
├── seed.js                # Seeds the database with sample data
├── config/
│   └── config.js          # Reads environment variables
├── db/
│   └── connect.js         # MongoDB connection
├── controllers/
│   ├── categoryController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── models/
│   ├── category.js
│   ├── product.js
│   ├── cart.js
│   └── order.js
├── routes/
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── middleware/
│   ├── validate.js        # Formats express-validator errors
│   └── errorHandler.js    # Global error handler
└── utils/
    ├── AppError.js
    ├── asyncHandler.js
    └── slugify.js

🚀 Getting Started

✅ Prerequisites


Node.js (v18+ recommended)
A MongoDB instance (local or a hosted cluster, e.g. MongoDB Atlas)


📥 Installation

bashgit clone <your-repo-url>
cd ecommerence_backend
npm install

🔑 Environment Variables

Copy .env.example to .env and fill in your values:

PORT=3000
MONGO_URI=your-mongo-url

▶️ Running the App

bash# development (auto-restarts on file changes)
npm run dev

# production
npm start

The API will start on the port defined in .env (defaults to 5000 if not set) and log a health check at GET /.

🌱 Seeding Sample Data

bashnpm run seed

This clears existing orders, carts, products, and categories, then inserts sample Electronics, Books, and Clothing categories along with a handful of products.

📚 API Reference

Base URL: /api

🗂️ Categories — /api/categories

MethodEndpointDescriptionGET/List all categoriesGET/:idGet a category by IDPOST/Create a category (name required, description optional)PATCH/:idUpdate a categoryDELETE/:idDelete a category

📦 Products — /api/products

MethodEndpointDescriptionGET/List products (see query params below)GET/:idGet a product by IDPOST/Create a product (name, description, price, category required; stock optional)PATCH/:idUpdate a productDELETE/:idDelete a product

Query parameters for GET /api/products:


category — filter by category ID
minPrice, maxPrice — filter by price range
inStock — true / false
search — case-insensitive match against name or description


🛍️ Cart — /api/cart

The cart is currently a single, global cart (no per-user/session key yet).

MethodEndpointDescriptionGET/Get the current cartDELETE/Clear the cartPOST/itemsAdd an item — body: { productId, quantity }PATCH/items/:productIdUpdate item quantity — body: { quantity } (0 removes the item)DELETE/items/:productIdRemove an item

🧾 Orders — /api/orders

MethodEndpointDescriptionPOST/Create an order from the current cart — body: { shippingAddress }GET/List all ordersGET/:idGet an order by IDPATCH/:id/statusUpdate order status — body: { status }


⚠️ Heads up: routes/orderRoutes.js currently imports productController instead of orderController, so the order endpoints described above aren't wired up as-is. Swap the controller import in that file to point at orderController for order creation, listing, and status updates to work.



📤 Response Format

All endpoints return JSON in a consistent shape:

json{
  "status": "success",
  "message": "Products retrieved successfully",
  "data": { }
}

Errors follow the same pattern with "status": "fail" (or "error") and an appropriate HTTP status code.
