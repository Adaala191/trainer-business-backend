const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createClient,
  getClients,
} = require("../controllers/clientController");

// CREATE
router.post("/", authMiddleware, roleMiddleware("trainer"), createClient);

// 👇 ADD THIS HERE
router.get("/", authMiddleware, roleMiddleware("trainer"), getClients);

// DEBUG (optional)
router.get("/test", (req, res) => {
  res.send("client route works");
});

module.exports = router;