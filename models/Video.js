// models/Video.js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    bunnyGuid: {
      type: String,
      required: true, // this will be the Bunny.net GUID
    },
    videoUrl: {
      type: String,
      required: true, // this will be the Bunny.net URL
    },
    thumbnailUrl: {
      type: String,
      required: true, // this will be the Bunny.net URL
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // optional: if you have a course model
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher", // optional: if you have a course model
    },
    length: {
      type: Number,
    },
    pdfs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pdf",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
