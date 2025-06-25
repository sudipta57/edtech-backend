import LiveClass from "../../models/Liveclass.js";
import Student from "../../models/Student.js";
import Video from "../../models/Video.js";
import axios from "axios";

export const createLiveClass = async (req, res) => {
  try {
    const { title, description, course, scheduledTime, teacher } = req.body;

    const roomName = `live_${title.replace(
      /\s+/g,
      "_"
    )}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const meetingLink = `https://meet.jit.si/${roomName}`;

    const newClass = new LiveClass({
      title,
      description,
      course,
      scheduledTime,
      roomName: meetingLink,
      teacher,
    });

    await newClass.save();

    res.status(201).json({
      message: "Live class created",
      liveClass: newClass,
    });
  } catch (err) {
    console.error("Error creating live class:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLiveClassesByFilters = async (req, res) => {
  try {
    const { courseId, title, date } = req.query;

    // Validate that courseId is provided
    if (!courseId) {
      return res.status(400).json({ error: "courseId is required" });
    }

    // Build the filter object dynamically
    const filter = {
      course: courseId,
    };

    if (title) {
      // Case-insensitive partial match for title
      filter.title = { $regex: title, $options: "i" };
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      filter.createdAt = {
        $gte: targetDate,
        $lt: nextDay,
      };
    }

    const videos = await LiveClass.find(filter)
      .select("-updatedAt -createdAt -__v ")
      .populate({
        path: "videoId",
        select: "thumbnailUrl", // Only include these from Video
      })
      .populate("teacher", "-createdAt -password -subject -__v -phone")
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getStudentsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const students = await Student.find({
      "receiptDetails.stream": courseId,
    });
    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getStudentAttendanceByLiveClassId = async (req, res) => {
  try {
    const { liveClassId, students } = req.body;

    const liveClass = await LiveClass.findById(liveClassId);
    if (!liveClass) {
      return res.status(404).json({ error: "Live class not found" });
    }

    liveClass.students = students; // Replace existing student list
    await liveClass.save(); // Save changes

    res.status(200).json({
      message: "Attendance updated successfully",
      liveClass,
    });
  } catch (err) {
    console.error("Error updating student attendance:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPresentStudents = async (req, res) => {
  try {
    const { liveClassId } = req.params;

    const liveClass = await LiveClass.findById(liveClassId).populate(
      "students",
      "studentName mobile documents.studentPhoto"
    );

    if (!liveClass) {
      return res.status(404).json({ error: "Live class not found" });
    }

    res.status(200).json(liveClass.students);
  } catch (err) {
    console.error("Error fetching present students:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateLiveClass = async (req, res) => {
  const { _id, title, description, course, teacher } = req.body;

  try {
    const updateData = {
      title,
      description,
      course,
      teacher,
    };
    const updatedClass = await LiveClass.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    if (!updatedClass) {
      return res.status(404).json({ error: "Live class not found" });
    }
    res
      .status(200)
      .json({ message: "Live class updated", liveClass: updatedClass });
  } catch (err) {
    console.error("Error updating live class:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteLiveClass = async (req, res) => {
  const { liveClassId } = req.body;
  try {
    if (!liveClassId) {
      return res.status(400).json({ error: "liveClassId is required" });
    }
    const deletedClass = await LiveClass.findByIdAndDelete(liveClassId);
    if (!deletedClass) {
      return res.status(404).json({ error: "Live class not found" });
    }
    // If there are other related data to delete, do it here
    if (deletedClass.videoId) {
      try {
        const video = await Video.findByIdAndDelete(deletedClass.videoId);
        if (video && video.bunnyGuid) {
          try {
            await axios.delete(
              `https://video.bunnycdn.com/library/${process.env.LIBRARY_ID}/videos/${video.bunnyGuid}`,
              {
                headers: {
                  AccessKey: process.env.BUNNY_API_KEY,
                },
              }
            );
          } catch (bunnyError) {
            console.error("Error deleting from Bunny.net:", bunnyError);
            // Continue with database deletion even if Bunny.net deletion fails
          }
        }
      } catch (videoErr) {
        console.error("Error deleting associated video:", videoErr);
      }
    }
    res.status(200).json({
      message: "Live class deleted successfully",
      liveClass: deletedClass,
    });
  } catch (err) {
    console.error("Error deleting live class:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
