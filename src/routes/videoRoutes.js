const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createVideo,
  assignVideoToClient,
  getClientVideos,
  updateWatchedStatus,
} = require("../controllers/videoController");



router.post(
  "/",
  authMiddleware,
  roleMiddleware("trainer"),
  createVideo
);

router.post(
  "/:videoId/assign/:clientId",
  authMiddleware,
  roleMiddleware("trainer"),
  assignVideoToClient
);

router.get(
  "/client/:clientId",
  authMiddleware,
  roleMiddleware("trainer"),
  getClientVideos
);

router.patch(
  "/client-videos/:assignmentId/watched",
  authMiddleware,
  updateWatchedStatus
);

module.exports = router;