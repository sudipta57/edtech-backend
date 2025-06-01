import Student from "../../models/Student.js"; // Import the Student model
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
// Create a new student
export const createStudent = async (req, res) => {
  try {
    const files = req.files;
    const {
      studentName,
      dateOfBirth,
      gender,
      cast,
      religion,
      homeAddress,
      mobile,
      email,
      fatherName,
      motherName,
      fatherOccupation,
      familyIncome,
      fatherQualification,
      lastSchoolName,
      madhyamikRollNo,
      hsRollNo,
      aadharNo,
      bankAccountNo,
      lastExamDetails,
      receiptDetails,
      password,
    } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const student = new Student({
      studentName,
      dateOfBirth,
      gender,
      cast,
      religion,
      homeAddress,
      mobile,
      email,
      fatherName,
      motherName,
      fatherOccupation,
      familyIncome,
      fatherQualification,
      lastSchoolName,
      madhyamikRollNo,
      hsRollNo,
      aadharNo,
      bankAccountNo,
      password: hashedPassword,
      lastExamDetails: JSON.parse(lastExamDetails),
      documents: {
        aadhar: "/uploads/studentImages/" + files.aadhar?.[0]?.filename,
        madhyamikAdmit:
          "/uploads/studentImages/" + files.madhyamikAdmit?.[0]?.filename,
        madhyamikMarksheet:
          "/uploads/studentImages/" + files.madhyamikMarksheet?.[0]?.filename,
        hsAdmit: "/uploads/studentImages/" + files.hsAdmit?.[0]?.filename,
        hsMarksheet:
          "/uploads/studentImages/" + files.hsMarksheet?.[0]?.filename,
        casteCertificate:
          "/uploads/studentImages/" + files.casteCertificate?.[0]?.filename,
        studentPhoto:
          "/uploads/studentImages/" + files.studentPhoto?.[0]?.filename,
        guardianSignature:
          "/uploads/studentImages/" + files.guardianSignature?.[0]?.filename,
        studentSignature:
          "/uploads/studentImages/" + files.studentSignature?.[0]?.filename,
      },
    });

    await student.save();
    res
      .status(201)
      .json({ message: "Student registered successfully", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register student" });
  }
};

export const addPaymentReciept = async (req, res) => {
  try {
    const {
      studentId,
      stream,
      date,
      admissionFees,
      studyMaterial,
      weeklyTest,
      crashCourse,
      paymentMode,
      fullPayment,
      downPayment,
      installment1,
      installment2,
      installment3,
      installment4,
    } = req.body;

    // Store file names or file URLs (assuming you'll upload them somewhere)
    const officeSignature = req.files?.officeSignature?.[0]?.originalname || "";
    const guardianSignature =
      req.files?.guardianSignature?.[0]?.originalname || "";

    const receiptDetails = {
      stream,
      date,
      admissionFees: Number(admissionFees),
      studyMaterialFees: Number(studyMaterial),
      weeklyTestFees: Number(weeklyTest),
      crashCourseFees: Number(crashCourse),
      paymentMode,
      officeSignature: `/uploads/studentImages/${officeSignature}`,
      guardianSignature: `/uploads/studentImages/${guardianSignature}`,
    };

    if (paymentMode === "full") {
      receiptDetails.fullPayment = fullPayment;
    } else {
      receiptDetails.installment1 = Number(installment1);
      receiptDetails.installment2 = Number(installment2);
      receiptDetails.installment3 = Number(installment3);
      receiptDetails.installment4 = Number(installment4);
      receiptDetails.downPayment = Number(downPayment);
    }
    console.log(receiptDetails);

    // ✅ Update student document
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: { receiptDetails } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    return res
      .status(200)
      .json({ message: "Receipt added successfully", student });
  } catch (err) {
    console.error("Error in addPaymentReciept:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update student by ID
export const updateStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const updates = JSON.parse(req.body.updates || "{}");

    // Fetch current student
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Handle files (optional)
    if (req.files) {
      Object.entries(req.files).forEach(([key, files]) => {
        const file = files[0]; // multer gives files as array
        if (file) {
          // Delete existing file
          const existingPath = student.documents?.[key];
          if (existingPath) {
            const fullPath = path.join(process.cwd(), existingPath);
            console.log("fullPath", fullPath);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          }

          // Save new file path
          if (!updates.documents) updates.documents = {};

          updates.documents = {
            ...student.documents, // preserve existing documents
            ...updates.documents, // override with new uploaded files
            [key]: `/uploads/studentImages/${file.filename}`,
          };
        }
      });
    }
    console.log("updates", updates);
    // Update the student
    const updatedStudent = await Student.findByIdAndUpdate(studentId, updates, {
      new: true,
    });

    return res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Error updating student", error });
  }
};
// Get all students
export const getAllStudents = async (req, res) => {
  const { page = 1, limit = 10, name = "", mobile = "" } = req.query;
  const query = {};

  if (name) query.name = { $regex: name, $options: "i" };
  if (mobile) query.mobile = { $regex: mobile, $options: "i" };

  try {
    const students = await Student.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Student.countDocuments(query);

    res.json({ students, total });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Get a single student by ID
export const getSingleStudent = async (req, res) => {
  const { number, name } = req.query;

  try {
    const query = {};
    if (number) query.mobile = number;
    if (name) {
      if (name) {
        query.studentName = { $regex: new RegExp(`^${name}$`, "i") }; // case-insensitive exact match
      }
    }

    const student = await Student.find(query);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Error fetching student", error });
  }
};

// Delete student by ID
export const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error });
  }
};
