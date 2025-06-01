import fs from "fs";
import Pdf from "../../models/pdf.js";
import path from "path";

export const downloadPdf = async (req, res) => {
  try {
    const { pdfId } = req.params;
    const user = req.user; // From auth middleware
    // Optional: Validate that user has access to this PDF
    const pdf = await Pdf.findById(pdfId).populate("videoId").select("+course");
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    if (
      user.student?.receiptDetails?.stream.toString() !==
      pdf.videoId.course.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });
    }

    const filePath = path.join(
      process.cwd(), // root directory of your project
      "uploads/pdfs",
      path.basename(pdf.pdfUrl)
    );

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }
    console.log(filePath);
    // Send the file for download
    res.download(filePath);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
