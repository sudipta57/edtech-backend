import express from "express";
import {
  generateSignedBunnyUrl,
  GetvideoDetails,
  GetVideosForCourse,
  IsEligibleForVideo,
} from "../../controllers/student-controllers/videoController.js";
import AuthMiddleware from "../../middlewares/studentMiddleware/authMiddleware.js";
const router = express.Router();

router.get("/get-videos/:id/:subject", AuthMiddleware, GetVideosForCourse);
router.get("/is-eligible/:courseId", AuthMiddleware, IsEligibleForVideo);

router.get("/get-video-details/:videoId", AuthMiddleware, GetvideoDetails);

router.get("/secure-url/:videoGuid", AuthMiddleware, generateSignedBunnyUrl);

export default router;
