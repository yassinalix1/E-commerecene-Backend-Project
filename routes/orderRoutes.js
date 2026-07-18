const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const ctrl = require("../controllers/productController");

const router = express.Router();

router.get("/", ctrl.getAllProducts);
router.get("/:id", ctrl.getProductById);

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("name is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("price").isFloat({ min: 0 }).withMessage("price must be >= 0"),
    body("stock").optional().isInt({ min: 0 }),
    body("category").notEmpty().withMessage("category is required"),
    body("images").optional().isArray(),
  ],
  validate,
  ctrl.createProduct
);

router.patch(
  "/:id",
  [
    body("price").optional().isFloat({ min: 0 }),
    body("stock").optional().isInt({ min: 0 }),
    body("images").optional().isArray(),
  ],
  validate,
  ctrl.updateProduct
);

router.delete("/:id", ctrl.deleteProduct);

module.exports = router;