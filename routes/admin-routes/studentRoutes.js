import express from "express";
import {
  addPaymentReciept,
  createStudent,
  deleteStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
} from "../../controllers/admin-controllers/studentController.js";
import Studentupload from "../../middlewares/admin-middleware/UserImageUpload.js";
import { upload } from "../../middlewares/admin-middleware/upload.js";
import { upload as updateUpload } from "../../middlewares/admin-middleware/UpdateStudent.js";
const router = express.Router();
router.post(
  "/create",
  Studentupload.fields([
    { name: "aadhar" },
    { name: "madhyamikAdmit" },
    { name: "madhyamikMarksheet" },
    { name: "hsAdmit" },
    { name: "hsMarksheet" },
    { name: "casteCertificate" },
    { name: "studentPhoto" },
    { name: "guardianSignature" },
    { name: "studentSignature" },
  ]),
  createStudent
);
router.post(
  "/add-payment-reciept",
  upload.fields([
    { name: "officeSignature", maxCount: 1 },
    { name: "guardianSignature", maxCount: 1 },
  ]),
  addPaymentReciept
);
router.get("/get-all-student", getAllStudents);
router.get("/get-single-student", getSingleStudent);
router.patch(
  "/update/:studentId",
  updateUpload.fields([
    { name: "aadhar" },
    { name: "madhyamikAdmit" },
    { name: "madhyamikMarksheet" },
    { name: "hsAdmit" },
    { name: "hsMarksheet" },
    { name: "casteCertificate" },
    { name: "studentPhoto" },
    { name: "guardianSignature" },
    { name: "studentSignature" },
  ]),
  updateStudent
);
router.delete("/delete/:id", deleteStudent);

export default router;
