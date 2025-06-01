import express from "express";
import { getALlUpcomingClasses } from "../../controllers/student-controllers/liveClassController.js";
import AuthMiddleware from "../../middlewares/studentMiddleware/authMiddleware.js";
const router = express.Router();

router.get("/get-upcoming-classes", AuthMiddleware, getALlUpcomingClasses);

export default router;
