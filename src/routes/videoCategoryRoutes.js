const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createCategory,
} = require("../controllers/videoCategoryController");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("trainer"),
  createCategory
);

module.exports = router;