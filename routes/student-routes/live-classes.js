import express from "express";
import {
  getALlUpcomingClasses,
  getCurrentlyGoingLiveClass,
} from "../../controllers/student-controllers/liveClassController.js";
import AuthMiddleware from "../../middlewares/studentMiddleware/authMiddleware.js";
const router = express.Router();

router.get("/get-upcoming-classes/", AuthMiddleware, getALlUpcomingClasses);
router.get("/ongoing", AuthMiddleware, getCurrentlyGoingLiveClass);

export default router;
