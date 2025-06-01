import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import adminLoginRoutes from "./routes/admin-routes/adminLogin.js";
import courseRoutes from "./routes/admin-routes/courseRoute.js";
import liveClassRoutes from "./routes/admin-routes/liveClassRoute.js";
import pdfRoutes from "./routes/admin-routes/pdfRoute.js";
import studentRoutes from "./routes/admin-routes/studentRoutes.js";
import videoRoutes from "./routes/admin-routes/videoRoutes.js";
import authRoutes from "./routes/student-routes/auth.js";
import StudentCourseRoutes from "./routes/student-routes/course.js";
import liveClassRoutesForStudents from "./routes/student-routes/live-classes.js";
import profileRoutes from "./routes/student-routes/profile.js";
import videoRoutesForStudents from "./routes/student-routes/Video.js";
import pdfRoutesForStudents from "./routes/student-routes/pdfRoutes.js";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// admin Routes
app.use("/api/admin/login", adminLoginRoutes);
app.use("/api/admin/", adminLoginRoutes);
app.use("/api/admin/student", studentRoutes);
app.use("/api/admin/addpdf", pdfRoutes);
app.use("/api/admin/courses", courseRoutes);
app.use("/api/admin/live-class", liveClassRoutes);
app.use("/api/admin/videos", videoRoutes);
// student routes
app.use("/api/student/auth", authRoutes);
app.use("/api/student/profile", profileRoutes);
app.use("/api/student/course", StudentCourseRoutes);
app.use("/api/student/live-classes/", liveClassRoutesForStudents);
app.use("/api/student/videos", videoRoutesForStudents);
app.use("/api/student/pdfs", pdfRoutesForStudents);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
