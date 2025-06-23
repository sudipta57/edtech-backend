import Course from "../../models/Course.js";
import fs from "fs";

// @desc    Add a new course
// @route   POST /api/admin/add-course
// @access  Admin
const addCourse = async (req, res) => {
  try {
    const { title, category, lessons, subjects } = req.body;
    let image;
    console.log("Original subjects:", subjects);

    if (req.file) {
      image = `/uploads/courseImages/${req.file.filename}`;
    } else {
      return res.status(400).json({ error: "Course image is required" });
    }

    const validCategories = ["Engineering", "Medical", "Other Exams"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    // Handle subjects - convert stringified array to actual array if needed
    let processedSubjects = subjects;
    if (typeof subjects === "string") {
      try {
        processedSubjects = JSON.parse(subjects);
      } catch (error) {
        console.error("Error parsing subjects:", error);
        return res.status(400).json({ error: "Invalid subjects format" });
      }
    }

    // Ensure subjects is an array
    if (!Array.isArray(processedSubjects)) {
      return res.status(400).json({ error: "Subjects must be an array" });
    }

    console.log("Processed subjects:", processedSubjects);

    const course = new Course({
      title,
      category,
      lessons,
      subjects: processedSubjects,
      image,
    });
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

// @desc    Delete a specific course by ID
// @route   DELETE /api/admin/courses/:id
// @access  Admin
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate course ID
    if (!id) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    // Check if course exists
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Delete the course image from the filesystem
    if (course.image) {
      try {
        // Path is stored as /uploads/courseImages/image.jpg
        // We need a relative path from the project root.
        const imagePath = course.image.substring(1); // -> uploads/courseImages/image.jpg
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Deleted image: ${imagePath}`);
        }
      } catch (err) {
        console.error("Error deleting course image:", err);
        // Log the error but don't block course deletion
      }
    }

    // Delete the course from the database
    await Course.findByIdAndDelete(id);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { addCourse, getAllCourses, deleteCourse };
