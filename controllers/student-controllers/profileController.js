import Student from "../../models/Student.js";

export const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    const student = await Student.findById(studentId).select("-password");
    return res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const UpdateStudentProfile = async (req, res) => {
  try {
    const studentId = req.query.studentId;
    const { name, email, phone } = req.body;

    // Update the student profile in the database
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { name, email, phone },
      { new: true }
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
