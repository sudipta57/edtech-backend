import express from "express";
import { downloadPdf } from "../../controllers/student-controllers/PdfController.js";
import AuthMiddleware from "../../middlewares/studentMiddleware/authMiddleware.js";

const router = express.Router();

router.get("/download/:pdfId", AuthMiddleware, downloadPdf);

export default router;
