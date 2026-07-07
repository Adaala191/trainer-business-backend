const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createVideo,
  assignVideoToClient,
  getClientVideos,
  updateWatchedStatus,
  getVideos,
  patchVideo,
  deleteVideo,
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

router.get(
  "/",
  authMiddleware,
  roleMiddleware("trainer"),
  getVideos
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("trainer"),
  patchVideo
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("trainer"),
  deleteVideo
);

module.exports = router;