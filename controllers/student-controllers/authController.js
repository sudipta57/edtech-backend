import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../../models/Student.js";
const JWT_SECRET = process.env.JWT_SECRET || "sudipta_2006";

const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      return res
        .status(400)
        .json({ message: "Student ID and password are required." });
    }

    const student = await Student.findOne({
      mobile,
    }).select("-documents -lastExamDetails -createdAt -updatedAt ");

    if (!student) {
      return res
        .status(401)
        .json({ message: "Invalid student ID or password." });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid student ID or password." });
    }

    const token = jwt.sign(
      {
        student,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      student: {
        name: student.name,
        email: student.email,
        studentId: student._id,
        mobile: student.mobile,
      },
    });
  } catch (err) {
    console.error("Student login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
};

export { login };
