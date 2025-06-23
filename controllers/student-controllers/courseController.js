import mongoose from "mongoose";
import pdf from "../../models/pdf.js";
import Course from "../../models/Course.js";
import Student from "../../models/Student.js";

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
    // Get the authenticated student's ID from the request
    const studentId = req.user.student._id;

    // Find the student and populate the course information
    const student = await Student.findById(studentId).populate({
      path: "receiptDetails.stream",
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the student has a course assigned
    if (!student.receiptDetails || !student.receiptDetails.stream) {
      return res
        .status(404)
        .json({ message: "No course assigned to this student" });
    }

    // Fix stringified subjects if present
    const courseObj = student.receiptDetails.stream.toObject();
    console.log("courseobj is", courseObj);

    if (
      courseObj.subjects &&
      courseObj.subjects.length > 0 &&
      typeof courseObj.subjects[0] === "string"
    ) {
      try {
        const firstSubject = courseObj.subjects[0];
        if (firstSubject.startsWith("[") && firstSubject.endsWith("]")) {
          const parsedSubjects = JSON.parse(firstSubject);
          courseObj.subjects = parsedSubjects;
        }
      } catch (error) {
        console.error(
          "Error parsing subjects for course:",
          courseObj._id,
          error
        );
      }
    }

    // Return the course information
    return res.status(200).json({
      message: "Course retrieved successfully",
      course: courseObj,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
