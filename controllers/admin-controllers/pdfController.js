import Pdf from "../../models/pdf.js";

export const uploadPdf = async (req, res) => {
  try {
    const { title, description, course } = req.body;

    if (!req.files || !req.files.pdfs || req.files.pdfs.length === 0) {
      return res.status(400).json({ message: "No PDF file(s) uploaded" });
    }

    const savedPdfs = [];

    for (const file of req.files.pdfs) {
      const newPdf = new Pdf({
        title,
        description,
        video,
        pdfUrl: `/uploads/pdfs/${file.filename}`, // Save relative URL
      });

      const saved = await newPdf.save();
      savedPdfs.push(saved);
    }

    res.status(201).json({
      message: `${savedPdfs.length} PDF(s) uploaded successfully`,
      pdfs: savedPdfs,
    });
  } catch (error) {
    console.error("Error uploading PDF(s):", error);
    res.status(500).json({ message: "Failed to upload PDF(s)" });
  }
};

export const getAllPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find().populate("course", "title"); // Adjust fields if needed
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching PDFs" });
  }
};
