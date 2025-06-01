import express from "express";
import {
  getAllCourses,
  GetStudyMaterial,
} from "../../controllers/student-controllers/courseController.js";
import { GetVideosForCourse } from "../../controllers/student-controllers/videoController.js";
import AuthMiddleware from "../../middlewares/studentMiddleware/authMiddleware.js";
const router = express.Router();

router.get("/videos", AuthMiddleware, GetVideosForCourse);
router.get("/get-study-metarial", AuthMiddleware, GetStudyMaterial);
router.get("/", AuthMiddleware, getAllCourses);

export default router;
