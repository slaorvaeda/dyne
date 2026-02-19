const express = require("express");
const uploadRoutes = require("./upload");
const salesController = require("../controllers/salesController");
const ratingsController = require("../controllers/ratingsController");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

router.use("/sales/upload", uploadRoutes);

router.get("/sales/summary", salesController.getSummary);
router.get("/sales/trends", salesController.getTrends);
router.get("/sales/product-wise", salesController.getProductWise);
router.get("/sales/region-wise", salesController.getRegionWise);
router.get("/sales/category-wise", salesController.getCategoryWise);
router.get("/sales/categories", salesController.getCategories);
router.get("/sales/regions", salesController.getRegions);

// Ratings & Review Analytics
const uploadMiddleware = require("../middleware/upload");
router.post("/ratings/upload", uploadMiddleware.single("file"), async (req, res, next) => {
  try {
    await uploadController.uploadRatings(req, res);
  } catch (err) {
    next(err);
  }
});
router.get("/ratings/products-per-category", ratingsController.getProductsPerCategory);
router.get("/ratings/top-reviewed", ratingsController.getTopReviewed);
router.get("/ratings/discount-distribution", ratingsController.getDiscountDistribution);
router.get("/ratings/category-avg-rating", ratingsController.getCategoryAvgRating);
router.get("/ratings/list", ratingsController.getList);
router.get("/ratings/filters", ratingsController.getFilters);

module.exports = router;
