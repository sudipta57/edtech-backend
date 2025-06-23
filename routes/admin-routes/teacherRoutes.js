import express from "express";
import TeacherUpload from "../../middlewares/admin-middleware/TeacherImageUpload.js";
import {
  registerTeacher,
  loginTeacher,
  getAllTeachers,
  updateTeacher,
} from "../../controllers/admin-controllers/teacherController.js";

const router = express.Router();

// Register teacher (admin only)
router.post("/register", TeacherUpload.single("photo"), registerTeacher);

// Teacher login
router.post("/login", loginTeacher);

// Get all teachers
router.get("/all", getAllTeachers);

// update teachers
router.put("/update/:id", TeacherUpload.single("photo"), updateTeacher);

export default router;
