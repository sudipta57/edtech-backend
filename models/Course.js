import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    enums: ["Engineering", "Medical", "Other Exams"],
    type: String,
    required: true,
  },
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
