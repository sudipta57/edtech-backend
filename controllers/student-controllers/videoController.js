import Course from "../../models/Course.js";
import Video from "../../models/Video.js";
import mongoose from "mongoose";
import crypto from "crypto";
export const GetVideosForCourse = async (req, res) => {
  try {
    const { id, subject } = req.params;
    console.log(req.params);
    // Validate courseId
    if (!id) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Build the query
    const query = {
      course: new mongoose.Types.ObjectId(id),
    };

    // If a subject is provided and it's not 'all', filter by title
    if (subject && subject.toLowerCase() !== "all") {
      // Use regex for case-insensitive keyword search on the title
      query.title = { $regex: subject, $options: "i" };
    }

    // Fetch videos for the course from the database
    const videos = await Video.find(query)
      .select("-course")
      .populate("pdfs", "pdfUrl")
      .populate("teacher", "name photo");

    // Check if videos exist
    if (!videos || videos.length === 0) {
      const message =
        subject && subject.toLowerCase() !== "all"
          ? `No videos found for this course with subject "${subject}"`
          : "No videos found for this course";
      return res.status(404).json({ message });
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

export const GetvideoDetails = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId)
      .select("-course")
      .populate("pdfs", "pdfUrl")
      .populate("teacher", "name photo");

    return res.status(200).json(video);
  } catch (error) {
    console.error(error);
  }
};

export const generateSignedBunnyUrl = (req, res) => {
  const libraryId = process.env.LIBRARY_ID; // your Bunny library ID (e.g., 457413)
  const { videoGuid } = req.params;

  const baseUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoGuid}`;
  const key = process.env.BUNNY_SIGNING_KEY; // Bunny "Embed Token Authentication" key (not CDN key)
  const expiration = Math.floor(Date.now() / 1000) + 3600; // valid for 1 hour

  // ✅ Correct way: use SHA256 hash, not HMAC
  const tokenString = key + videoGuid + expiration;
  const token = crypto.createHash("sha256").update(tokenString).digest("hex");

  const signedUrl = `${baseUrl}?token=${token}&expires=${expiration}`;
  return res.status(200).json(signedUrl);
};
