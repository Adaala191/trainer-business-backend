const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  patchClient,
  deleteClient,
} = require("../controllers/clientController");

// CREATE
router.post("/", authMiddleware, roleMiddleware("trainer"), createClient);

// 👇 ADD THIS HERE
router.get("/", authMiddleware, roleMiddleware("trainer"), getClients);

router.get("/:id", authMiddleware, roleMiddleware("trainer"), getClientById);

router.put("/:id", authMiddleware, roleMiddleware("trainer"), updateClient);

router.patch("/:id", authMiddleware, roleMiddleware("trainer"), patchClient);

router.delete("/:id", authMiddleware, roleMiddleware("trainer"), deleteClient);

// DEBUG (optional)
router.get("/test", (req, res) => {
  res.send("client route works");
});

module.exports = router;