import express from "express";
import {
  getStudentProfile,
  UpdateStudentProfile,
} from "../../controllers/student-controllers/profileController.js";
import AuthMiddleware from "../../middlewares/studentMiddleware/authMiddleware.js";
const router = express.Router();

router.get("/", AuthMiddleware, getStudentProfile);
router.get("/profile/updateProfile", AuthMiddleware, UpdateStudentProfile);

export default router;
