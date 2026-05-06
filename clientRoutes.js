const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createClient,
  getClients,
} = require("../controllers/clientController");

// Create client
router.post("/", authMiddleware, roleMiddleware("trainer"), createClient);

// Get clients
router.get("/", authMiddleware, roleMiddleware("trainer"), getClients);

module.exports = router;