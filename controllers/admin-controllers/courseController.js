import Course from "../../models/Course.js";

// @desc    Add a new course
// @route   POST /api/admin/add-course
// @access  Admin
const addCourse = async (req, res) => {
  try {
    const { title, category } = req.body;

    const validCategories = ["Engineering", "Medical", "Other Exams"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const course = new Course({ title, category });
    await course.save();

    res.status(201).json({ message: "Course created successfully", course });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get all courses
// @route   GET /api/admin/courses
// @access  Admin
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    return res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { addCourse, getAllCourses };
