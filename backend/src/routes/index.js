const express = require("express");
const uploadRoutes = require("./upload");

const router = express.Router();

router.use("/sales/upload", uploadRoutes);

// Placeholder routes (to be implemented with controllers)
router.get("/sales/summary", (req, res) => {
  res.json({ totalRevenue: 0, totalQuantity: 0 });
});
router.get("/sales/trends", (req, res) => res.json([]));
router.get("/sales/product-wise", (req, res) => res.json([]));
router.get("/sales/region-wise", (req, res) => res.json([]));
router.get("/sales/categories", (req, res) => res.json([]));
router.get("/sales/regions", (req, res) => res.json([]));

module.exports = router;
