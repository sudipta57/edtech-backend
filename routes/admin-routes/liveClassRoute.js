import express from "express";
import {
  createLiveClass,
  getLiveClassesByFilters,
  getStudentsByCourseId,
  getStudentAttendanceByLiveClassId,
  getPresentStudents,
  updateLiveClass,
  deleteLiveClass,
} from "../../controllers/admin-controllers/liveClassController.js";

const router = express.Router();

// Create a new live class
router.post("/create", createLiveClass);
// // Get live classes by filters
router.get("/get-live-classes", getLiveClassesByFilters);

router.get("/get-students/:courseId", getStudentsByCourseId);

router.post("/student-attendance/", getStudentAttendanceByLiveClassId);

router.get("/get-present-students/:liveClassId", getPresentStudents);

router.put("/update/", updateLiveClass);

router.delete("/delete/", deleteLiveClass);

export default router;
