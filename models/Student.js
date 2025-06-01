import mongoose from "mongoose";
const studentSchema = new mongoose.Schema({
  studentName: String,
  dateOfBirth: Date,
  gender: String,
  cast: String,
  religion: String,
  homeAddress: String,
  mobile: String,
  email: String,
  password: String,
  fatherName: String,
  motherName: String,
  fatherOccupation: String,
  familyIncome: Number,
  fatherQualification: String,

  lastSchoolName: String,
  madhyamikRollNo: String,
  hsRollNo: String,
  aadharNo: String,
  bankAccountNo: String,

  lastExamDetails: {
    lastExamPassed: String,
    boardName: String,
    totalMarks: Number,
    percentage: Number,
    remarks: String,
  },

  documents: {
    aadhar: String,
    madhyamikAdmit: String,
    madhyamikMarksheet: String,
    hsAdmit: String,
    hsMarksheet: String,
    casteCertificate: String,
    studentPhoto: String,
    guardianSignature: String,
    studentSignature: String,
  },

  receiptDetails: {
    receiptNo: Number,
    stream: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    date: Date,
    admissionFees: Number,
    studyMaterialFees: Number,
    weeklyTestFees: Number,
    crashCourseFees: Number,
    paymentMode: String,
    fullPayment: String,
    installment1: Number,
    installment2: Number,
    installment3: Number,
    installment4: Number,
  },
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
