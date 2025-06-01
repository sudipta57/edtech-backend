import LiveClass from "../../models/Liveclass.js";
import Student from "../../models/Student.js";
export const createLiveClass = async (req, res) => {
  try {
    const { title, description, course, scheduledTime } = req.body;

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
    console.log(courseId, title, date);

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
      .select("-bunnyGuid -updatedAt -createdAt -__v -roomName")
      .populate({
        path: "videoId",
        select: "title videoUrl thumbnailUrl", // Only include these from Video
      })
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
