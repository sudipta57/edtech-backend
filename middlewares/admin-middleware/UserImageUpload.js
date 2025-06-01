import multer from "multer";
import path from "path";
import fs from "fs";

// Define storage settings with debug logs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/studentImages";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  },
});

// Define file filter with debug logs
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Initialize multer with the above settings
const Studentupload = multer({ storage, fileFilter });

export default Studentupload;
