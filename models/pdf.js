import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
  {
    pdfUrl: {
      type: String,
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pdf", pdfSchema);
