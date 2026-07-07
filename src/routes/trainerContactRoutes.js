const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createContactInfo,
  getContactInfo,
  patchContactInfo,
} = require("../controllers/trainerContactController");


router.post(
    "/",
    authMiddleware,
    roleMiddleware("trainer"),
    createContactInfo
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("trainer"),
  getContactInfo
);

router.patch(
  "/",
  authMiddleware,
  roleMiddleware("trainer"),
  patchContactInfo
);

module.exports = router;