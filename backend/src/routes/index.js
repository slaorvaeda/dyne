const express = require("express");
const uploadRoutes = require("./upload");
const salesController = require("../controllers/salesController");

const router = express.Router();

router.use("/sales/upload", uploadRoutes);

router.get("/sales/summary", salesController.getSummary);
router.get("/sales/trends", salesController.getTrends);
router.get("/sales/product-wise", salesController.getProductWise);
router.get("/sales/region-wise", salesController.getRegionWise);
router.get("/sales/category-wise", salesController.getCategoryWise);
router.get("/sales/categories", salesController.getCategories);
router.get("/sales/regions", salesController.getRegions);

module.exports = router;
