import express from "express";
import {
  addCourse,
  getAllCourses,
} from "../../controllers/admin-controllers/courseController.js";

const router = express.Router();

router.post("/add", addCourse);
router.get("/", getAllCourses);

export default router;
