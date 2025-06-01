import Course from "../../models/Course.js";
import Video from "../../models/Video.js";
import mongoose from "mongoose";
export const GetVideosForCourse = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    // Validate courseId
    if (!id) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Fetch videos for the course from the database
    const videos = await Video.find({
      course: new mongoose.Types.ObjectId(id),
    }).populate("pdfs");

    // Check if videos exist
    if (!videos || videos.length === 0) {
      return res
        .status(404)
        .json({ message: "No videos found for this course" });
    }

    // Return the videos
    return res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const IsEligibleForVideo = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = req.user;
    const student = user.student;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (student.receiptDetails.stream.toString() !== courseId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });
    }
    return res
      .status(200)
      .json({ message: "You are eligible for this course" });
  } catch (error) {
    console.error("Error checking eligibility:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
