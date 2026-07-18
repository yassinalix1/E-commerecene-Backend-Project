const connectDB = require("./db/connect");

const Category = require("./models/category");
const Product = require("./models/product");
const Order = require("./models/order");
const Cart = require("./models/cart");

const categoriesData = [
  { name: "Electronics", description: "Phones, laptops, and gadgets" },
  { name: "Books", description: "Fiction, non-fiction and comics" },
  { name: "Clothing", description: "Men and women apparel" },
];

const productsFor = (catMap) => [
  {
    name: "Wireless Headphones",
    description: "Bluetooth 5.3 over-ear headphones with ANC",
    price: 199.99,
    stock: 25,
    category: catMap.Electronics,
    images: ["https://picsum.photos/seed/headphones/400"],
  },
  {
    name: "Smartphone Pro",
    description: "6.5-inch AMOLED, 128GB, dual camera",
    price: 899,
    stock: 10,
    category: catMap.Electronics,
    images: ["https://picsum.photos/seed/phone/400"],
  },
  {
    name: "Clean Code",
    description: "A Handbook of Agile Software Craftsmanship",
    price: 34.5,
    stock: 40,
    category: catMap.Books,
    images: ["https://picsum.photos/seed/cleancode/400"],
  },
  {
    name: "The Pragmatic Programmer",
    description: "Your journey to mastery, 20th anniversary edition",
    price: 39.9,
    stock: 30,
    category: catMap.Books,
    images: ["https://picsum.photos/seed/pragmatic/400"],
  },
  {
    name: "Cotton T-Shirt",
    description: "Unisex 100% cotton crew-neck t-shirt",
    price: 19.99,
    stock: 100,
    category: catMap.Clothing,
    images: ["https://picsum.photos/seed/tshirt/400"],
  },
  {
    name: "Denim Jeans",
    description: "Slim-fit blue denim jeans",
    price: 49.99,
    stock: 0,
    category: catMap.Clothing,
    images: ["https://picsum.photos/seed/jeans/400"],
  },
];

const seed = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    console.log("Cleared existing orders, cart, products, and categories");

    const categories = await Category.insertMany(categoriesData);
    const catMap = categories.reduce((acc, c) => {
      acc[c.name] = c._id;
      return acc;
    }, {});
    console.log(`Inserted ${categories.length} categories`);

    const products = await Product.insertMany(productsFor(catMap));
    console.log(`Inserted ${products.length} products`);

    console.log(
      `Seeding complete: ${categories.length} categories and ${products.length} products added.`,
    );
  } catch (err) {
    console.error("Seed error:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seed();