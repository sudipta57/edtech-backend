import LiveClass from "../../models/Liveclass.js";

export const getALlUpcomingClasses = async (req, res) => {
  try {
    const { courseId } = req.query;

    // Validate the courseId
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Fetch upcoming classes from the database
    const upcomingClasses = await LiveClass.find({
      course: courseId,
      scheduledTime: { $gt: new Date() },
    });

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
