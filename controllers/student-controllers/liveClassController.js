import LiveClass from "../../models/Liveclass.js";

export const getALlUpcomingClasses = async (req, res) => {
  try {
    const courseId = req.user.student.stream;

    // Validate the courseId
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Fetch upcoming classes from the database
    const upcomingClasses = await LiveClass.find({
      course: courseId,
      scheduledTime: { $gt: new Date() },
    }).select("-course -createdAt -description -roomName -students");

    // Check if any upcoming classes were found
    if (upcomingClasses.length === 0) {
      return res.status(404).json({ message: "No upcoming classes found" });
    }

    // Return the list of upcoming classes
    return res.status(200).json(upcomingClasses);
  } catch (error) {
    console.error("Error fetching upcoming classes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentlyGoingLiveClass = async (req, res) => {
  try {
    const courseId = req.user.student.stream;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const now = new Date();

    const allMatches = await LiveClass.find({
      course: courseId,
      scheduledTime: { $lte: now },
    })
      .select("-course -createdAt -description -students")
      .populate("teacher", "name photo");

    const ongoing = allMatches.filter((cls) => {
      const start = new Date(cls.scheduledTime);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + (cls.durationInMinutes ?? 60));

      return now >= start && now <= end; // ✅ Ongoing means: started & not yet ended
    });

    if (ongoing.length === 0) {
      return res.status(404).json({ message: "No ongoing classes found" });
    }

    return res.status(200).json(allMatches);
  } catch (error) {
    console.error("Error fetching ongoing classes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
