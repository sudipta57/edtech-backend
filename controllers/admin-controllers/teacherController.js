import Teacher from "../../models/Teacher.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerTeacher = async (req, res) => {
  try {
    const { name, phone, password, subject } = req.body;

    const photo = req.file
      ? `/uploads/teacherImages/${req.file.filename}`
      : undefined;
    const existingTeacher = await Teacher.findOne({ phone });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = new Teacher({
      name,
      phone,
      password: hashedPassword,
      photo,
      subject,
    });
    await newTeacher.save();
    return res.status(201).json({ message: "Teacher registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

export const loginTeacher = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const teacher = await Teacher.findOne({ phone });
    if (!teacher) {
      return res.status(401).json({ message: "Invalid phone or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid phone or password" });
    }
    const token = jwt.sign(
      { id: teacher._id },
      process.env.JWT_SECRET || "sudipta_2006"
    );
    return res
      .status(200)
      .json({ message: "Login successful", user: teacher, token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select("-password ");
    teachers.map((teacher) => {
      teacher.photo = `http://localhost:5000${teacher.photo}`;
    });
    res.status(200).json(teachers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch teachers", error: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, subject } = req.body;
    let updateData = { name, phone, subject };
    if (req.file) {
      updateData.photo = `/uploads/teacherImages/${req.file.filename}`;
    }
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    if (updatedTeacher.photo) {
      updatedTeacher.photo = `http://localhost:5000${updatedTeacher.photo}`;
    }
    res.status(200).json({
      message: "Teacher updated successfully",
      teacher: updatedTeacher,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update teacher", error: error.message });
  }
};
