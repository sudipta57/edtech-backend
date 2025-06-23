import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  photo: { type: String },
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  subject: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
