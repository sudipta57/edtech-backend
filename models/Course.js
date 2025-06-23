import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Engineering", "Medical", "Other Exams"], // ✅ Correct way to use enum
    required: true,
  },
  lessons: {
    type: Number,
  },
  subjects: {
    type: [String], // ✅ Prefer this over `type: Array` for better schema validation
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
