const express = require("express");
const ctrl = require("../controllers/cartController");

const router = express.Router();

router.get("/", ctrl.getCart);
router.delete("/", ctrl.clearCart);

router.post("/items", ctrl.addItem);
router.patch("/items/:productId", ctrl.updateItem);
router.delete("/items/:productId", ctrl.removeItem);

module.exports = router;