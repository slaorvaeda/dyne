const express = require("express");
const uploadMiddleware = require("../middleware/upload");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

router.post("/", uploadMiddleware.single("file"), async (req, res, next) => {
  try {
    await uploadController.uploadSales(req, res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
