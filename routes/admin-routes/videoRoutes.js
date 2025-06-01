import express from "express";
import { body } from "express-validator";
import {
  deleteVideo,
  getPresignedUpload,
  getVideosByFilters,
  getVideoStatus,
  saveUploadedVideo,
  updateVideo,
} from "../../controllers/admin-controllers/videoController.js";
import pdfupload from "../../middlewares/admin-middleware/pdfUpload.js";
const router = express.Router();

// Validation middleware
const validateVideoUpload = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("course").notEmpty().withMessage("Course is required"),
];

// router.post("/add", upload.single("file"), validateVideoUpload, uploadVideo);

router.post("/presign", getPresignedUpload);

router.post("/save", saveUploadedVideo);

router.get("/status/:guid", getVideoStatus);

router.put("/update/:_id", pdfupload.fields([{ name: "pdfs" }]), updateVideo);

router.get("/get-videos", getVideosByFilters);

router.delete("/delete/:_id", deleteVideo);

export default router;
