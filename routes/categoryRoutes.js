const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const ctrl = require("../controllers/categoryController");

const router = express.Router();

router.get("/", ctrl.getAllCategories);
router.get("/:id", ctrl.getCategoryById);

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("name is required").trim(),
    body("description").optional().trim(),
  ],
  validate,
  ctrl.createCategory
);

router.patch(
  "/:id",
  [
    body("name").optional().trim().notEmpty(),
    body("description").optional().trim(),
  ],
  validate,
  ctrl.updateCategory
);

router.delete("/:id", ctrl.deleteCategory);

module.exports = router;