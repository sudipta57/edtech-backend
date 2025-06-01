import mongoose from "mongoose";
import pdf from "../../models/pdf.js";
import Course from "../../models/Course.js";

export const GetStudyMaterial = async (req, res) => {
  try {
    const { videoId } = req.query;

    // Validate courseId
    if (!videoId) {
      return res.status(400).json({ message: "Video ID is required" });
    }

    // Fetch study material for the course from the database
    const studyMaterial = await pdf.find({
      video: new mongoose.Types.ObjectId(videoId),
    });

    // Check if study material exists
    if (!studyMaterial || studyMaterial.length === 0) {
      return res
        .status(404)
        .json({ message: "No study material found for this course" });
    }

    // Return the study material
    return res.status(200).json(studyMaterial);
  } catch (error) {
    console.error("Error fetching study material:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    return res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
