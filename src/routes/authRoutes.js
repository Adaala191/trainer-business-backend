const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});


router.get("/trainer-only", authMiddleware, roleMiddleware("trainer"), (req, res) => {
  res.json({ message: "Welcome trainer", user: req.user });
});

router.get("/client-only", authMiddleware, roleMiddleware("client"), (req, res) => {
  res.json({ message: "Welcome client", user: req.user });
});

module.exports = router;