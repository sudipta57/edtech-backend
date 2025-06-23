import express from "express";
import {
  addCourse,
  deleteCourse,
  getAllCourses,
} from "../../controllers/admin-controllers/courseController.js";
import { upload } from "../../middlewares/admin-middleware/CourseImageUpload.js";
import fs from "fs";

const router = express.Router();

// Ensure courseImages directory exists
const courseImagesPath = "./uploads/courseImages";
if (!fs.existsSync(courseImagesPath))
  fs.mkdirSync(courseImagesPath, { recursive: true });

const courseImageUpload = upload;

router.post("/add", courseImageUpload.single("image"), addCourse);
router.get("/", getAllCourses);
router.delete("/delete/:id", deleteCourse);

export default router;
