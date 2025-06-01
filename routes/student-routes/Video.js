import express from "express";
import {
  GetVideosForCourse,
  IsEligibleForVideo,
} from "../../controllers/student-controllers/videoController.js";
import AuthMiddleware from "../../middlewares/studentMiddleware/authMiddleware.js";
const router = express.Router();

router.get("/get-videos/:id", AuthMiddleware, GetVideosForCourse);
router.get("/is-eligible/:courseId", AuthMiddleware, IsEligibleForVideo);

export default router;
