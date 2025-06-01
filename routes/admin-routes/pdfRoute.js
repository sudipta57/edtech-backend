import express from "express";
import upload from "../../middlewares/admin-middleware/pdfUpload.js";
import {
  uploadPdf,
  getAllPdfs,
} from "../../controllers/admin-controllers/pdfController.js";

const router = express.Router();

router.put("/upload/:_id", upload.fields([{ name: "pdfs" }]), uploadPdf);

router.get("/", getAllPdfs);

export default router;
